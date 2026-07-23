const { expect } = require('chai')
const { ethers } = require('hardhat')

const HOUR = 60 * 60
const parseUsdc = (value) => ethers.parseUnits(String(value), 6)
const joinHash = ethers.keccak256(ethers.toUtf8Bytes('JOINCODE'))

async function deployFixture() {
  const [owner, treasury, arbiter, seller, buyer, secondArbiter, stranger] = await ethers.getSigners()
  const MockUSDC = await ethers.getContractFactory('MockUSDC')
  const usdc = await MockUSDC.deploy()
  await usdc.waitForDeployment()

  const BoundTestnet = await ethers.getContractFactory('BoundTestnet')
  const bond = await BoundTestnet.deploy(await usdc.getAddress(), treasury.address, arbiter.address, 'BOND Arbiter')
  await bond.waitForDeployment()

  return { owner, treasury, arbiter, seller, buyer, secondArbiter, stranger, usdc, bond }
}

async function createJoinFundDeliver(ctx) {
  const { bond, usdc, seller, buyer } = ctx
  const price = parseUsdc(100)
  await bond.connect(seller).createRoom('NFT escrow', price, 0, joinHash, true, 5)
  const roomId = await bond.roomCount()
  await bond.connect(buyer).joinRoom(roomId, ethers.toUtf8Bytes('JOINCODE'))
  const fee = await bond.fundingFee(price)
  await usdc.mint(buyer.address, price + fee)
  await usdc.connect(buyer).approve(await bond.getAddress(), price + fee)
  await bond.connect(buyer).fundRoom(roomId)
  await bond.connect(seller).markDelivered(roomId, ethers.ZeroHash)
  return { roomId, price, fee }
}

describe('BoundTestnet', function () {
  it('charges funding tax to buyer on top of room price, not from seller payout', async function () {
    const ctx = await deployFixture()
    const { bond, usdc, seller, buyer, treasury } = ctx
    const price = parseUsdc(100)
    const fee = await bond.fundingFee(price)

    await bond.connect(seller).createRoom('Design delivery', price, 0, joinHash, true, 5)
    await bond.connect(buyer).joinRoom(1, ethers.toUtf8Bytes('JOINCODE'))
    await usdc.mint(buyer.address, price + fee)
    await usdc.connect(buyer).approve(await bond.getAddress(), price + fee)

    await expect(bond.connect(buyer).fundRoom(1))
      .to.emit(bond, 'RoomFunded')
      .withArgs(1, price, fee, price + fee)

    const room = await bond.rooms(1)
    expect(room.fundedAmount).to.equal(price)
    expect(room.platformFee).to.equal(fee)
    expect(await usdc.balanceOf(await bond.getAddress())).to.equal(price + fee)

    await bond.connect(seller).markDelivered(1, ethers.ZeroHash)
    await bond.connect(buyer).releaseFunds(1)

    expect(await usdc.balanceOf(seller.address)).to.equal(price)
    expect(await usdc.balanceOf(treasury.address)).to.equal(fee)
    expect(await usdc.balanceOf(await bond.getAddress())).to.equal(0)
  })

  it('does not expose review timeout modes on room creation', async function () {
    const { bond, seller } = await deployFixture()
    const price = parseUsdc(50)

    await expect(bond.connect(seller).createRoom('Any deal', price, 0, joinHash, true, 5))
      .to.emit(bond, 'RoomCreated')
  })

  it('sets arbiter fallback to delivered time plus fixed response buffer', async function () {
    const ctx = await deployFixture()
    const { bond } = ctx
    const { roomId } = await createJoinFundDeliver(ctx)

    const room = await bond.rooms(roomId)
    expect(await bond.RESPONSE_BUFFER()).to.equal(BigInt(12 * HOUR))
    expect(room.confirmDeadline - room.deliveredAt).to.equal(BigInt(12 * HOUR))
  })

  it('lets buyer settle any delivered room immediately', async function () {
    const ctx = await deployFixture()
    const { bond, usdc, seller, buyer, treasury } = ctx
    const { roomId, price, fee } = await createJoinFundDeliver(ctx)

    await bond.connect(buyer).releaseFunds(roomId)

    expect(await usdc.balanceOf(seller.address)).to.equal(price)
    expect(await usdc.balanceOf(treasury.address)).to.equal(fee)
  })

  it('blocks seller escalation before the response buffer passes', async function () {
    const ctx = await deployFixture()
    const { bond, seller } = ctx
    const { roomId } = await createJoinFundDeliver(ctx)

    await expect(bond.connect(seller).escalateNoResponse(roomId))
      .to.be.revertedWith('Response buffer still open')
  })

  it('lets seller escalate to arbiter after buyer is silent past the response buffer', async function () {
    const ctx = await deployFixture()
    const { bond, seller } = ctx
    const { roomId } = await createJoinFundDeliver(ctx)

    await ethers.provider.send('evm_increaseTime', [12 * HOUR + 1])
    await ethers.provider.send('evm_mine')

    await expect(bond.connect(seller).escalateNoResponse(roomId))
      .to.emit(bond, 'EscalatedNoResponse')
  })

  it('lets owner add and remove arbiters', async function () {
    const { bond, owner, secondArbiter, stranger } = await deployFixture()

    await expect(bond.connect(owner).addArbiter(secondArbiter.address, 'Second Arbiter'))
      .to.emit(bond, 'ArbiterAdded')
      .withArgs(secondArbiter.address, 'Second Arbiter')

    expect(await bond.isArbiter(secondArbiter.address)).to.equal(true)
    expect(await bond.arbiterDisplayName(secondArbiter.address)).to.equal('Second Arbiter')

    await expect(bond.connect(stranger).addArbiter(stranger.address, 'Bad Arbiter'))
      .to.be.revertedWith('Only owner')

    await expect(bond.connect(owner).removeArbiter(secondArbiter.address))
      .to.emit(bond, 'ArbiterRemoved')
      .withArgs(secondArbiter.address)

    expect(await bond.isArbiter(secondArbiter.address)).to.equal(false)
  })

  it('allows an active arbiter to resolve a disputed room and rejects removed arbiters', async function () {
    const ctx = await deployFixture()
    const { bond, owner, secondArbiter, seller } = ctx
    const { roomId } = await createJoinFundDeliver(ctx)

    await ethers.provider.send('evm_increaseTime', [12 * HOUR + 1])
    await ethers.provider.send('evm_mine')
    await bond.connect(seller).escalateNoResponse(roomId)

    await expect(bond.connect(secondArbiter).arbiterResolve(roomId, seller.address))
      .to.be.revertedWith('Not authorized')

    await bond.connect(owner).addArbiter(secondArbiter.address, 'Second Arbiter')
    await expect(bond.connect(secondArbiter).arbiterResolve(roomId, seller.address))
      .to.emit(bond, 'DisputeResolved')

    expect(await bond.successCount(seller.address)).to.equal(1)

    // New room proves removed arbiter loses authority.
    await bond.connect(owner).removeArbiter(secondArbiter.address)
    const { roomId: secondRoomId } = await createJoinFundDeliver(ctx)
    await ethers.provider.send('evm_increaseTime', [12 * HOUR + 1])
    await ethers.provider.send('evm_mine')
    await bond.connect(seller).escalateNoResponse(secondRoomId)

    await expect(bond.connect(secondArbiter).arbiterResolve(secondRoomId, seller.address))
      .to.be.revertedWith('Not authorized')
  })
})
