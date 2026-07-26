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

  const BOND = await ethers.getContractFactory('BOND')
  const bond = await BOND.deploy(await usdc.getAddress(), treasury.address, arbiter.address, 'BOND Arbiter')
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

describe('BOND', function () {
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

  it('revokes stale primary arbiter authority when rotating setArbiter', async function () {
    const ctx = await deployFixture()
    const { bond, owner, arbiter, secondArbiter, seller } = ctx

    await expect(bond.connect(owner).setArbiter(secondArbiter.address, 'Rotated Arbiter'))
      .to.emit(bond, 'ArbiterRemoved')
      .withArgs(arbiter.address)
      .and.to.emit(bond, 'ArbiterAdded')
      .withArgs(secondArbiter.address, 'Rotated Arbiter')

    expect(await bond.isArbiter(arbiter.address)).to.equal(false)
    expect(await bond.isArbiter(secondArbiter.address)).to.equal(true)
    expect(await bond.arbiter()).to.equal(secondArbiter.address)

    const { roomId } = await createJoinFundDeliver(ctx)
    await ethers.provider.send('evm_increaseTime', [12 * HOUR + 1])
    await ethers.provider.send('evm_mine')
    await bond.connect(seller).escalateNoResponse(roomId)

    await expect(bond.connect(arbiter).arbiterResolve(roomId, seller.address))
      .to.be.revertedWith('Not authorized')
    await expect(bond.connect(secondArbiter).arbiterResolve(roomId, seller.address))
      .to.emit(bond, 'DisputeResolved')
  })

  it('lets the joined counterparty leave before funding and restores the room to created', async function () {
    const { bond, usdc, seller, buyer } = await deployFixture()
    const collateral = parseUsdc(12)

    await bond.connect(buyer).createRoom('Seller can leave before funding', parseUsdc(80), collateral, joinHash, false, 5)
    await usdc.mint(seller.address, collateral)
    await usdc.connect(seller).approve(await bond.getAddress(), collateral)
    await bond.connect(seller).joinRoom(1, ethers.toUtf8Bytes('JOINCODE'))

    expect(await usdc.balanceOf(await bond.getAddress())).to.equal(collateral)
    expect(await bond.activeRooms(seller.address)).to.equal(1n)

    await expect(bond.connect(seller).leaveRoom(1))
      .to.emit(bond, 'RoomLeft')
      .withArgs(1, seller.address)

    const room = await bond.rooms(1)
    expect(room.counterparty).to.equal(ethers.ZeroAddress)
    expect(room.joinedAt).to.equal(0n)
    expect(room.state).to.equal(0n)
    expect(await bond.activeRooms(seller.address)).to.equal(0n)
    expect(await usdc.balanceOf(seller.address)).to.equal(collateral)

    await expect(bond.connect(buyer).leaveRoom(1))
      .to.be.revertedWith('Not joined')
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

  it('bounds user-controlled strings that are stored on-chain', async function () {
    const { bond, owner, seller, buyer } = await deployFixture()
    const price = parseUsdc(10)
    const maxItem = 'x'.repeat(160)
    const longItem = 'x'.repeat(161)
    const multibyteItem = '🟡'.repeat(41) // 164 UTF-8 bytes
    const longReason = 'x'.repeat(501)
    const longEvidenceRef = 'x'.repeat(301)

    await expect(bond.connect(seller).createRoom(maxItem, price, 0, joinHash, true, 5))
      .to.emit(bond, 'RoomCreated')

    await expect(bond.connect(seller).createRoom(longItem, price, 0, joinHash, true, 5))
      .to.be.revertedWith('Item too long')

    await expect(bond.connect(seller).createRoom(multibyteItem, price, 0, joinHash, true, 5))
      .to.be.revertedWith('Item too long')

    await expect(bond.connect(owner).addArbiter(buyer.address, 'x'.repeat(64)))
      .to.emit(bond, 'ArbiterAdded')

    await expect(bond.connect(owner).addArbiter(buyer.address, 'x'.repeat(65)))
      .to.be.revertedWith('Arbiter name too long')

    const fresh = await deployFixture()
    const freshRoom = await createJoinFundDeliver(fresh)
    await expect(fresh.bond.connect(fresh.buyer).openDispute(freshRoom.roomId, 'x'.repeat(500), 'text', '', ''))
      .to.emit(fresh.bond, 'RoomDisputed')

    const freshLongReason = await deployFixture()
    const freshLongReasonRoom = await createJoinFundDeliver(freshLongReason)
    await expect(freshLongReason.bond.connect(freshLongReason.buyer).openDispute(freshLongReasonRoom.roomId, longReason, 'text', '', ''))
      .to.be.revertedWith('Reason too long')

    await expect(fresh.bond.connect(fresh.buyer).submitEvidence(freshRoom.roomId, 'text', 'ok', 'x'.repeat(300)))
      .to.emit(fresh.bond, 'EvidenceSubmitted')

    await expect(fresh.bond.connect(fresh.buyer).submitEvidence(freshRoom.roomId, 'text', 'ok', longEvidenceRef))
      .to.be.revertedWith('Evidence ref too long')

    const capped = await deployFixture()
    const cappedRoom = await createJoinFundDeliver(capped)
    await capped.bond.connect(capped.buyer).openDispute(cappedRoom.roomId, 'bad delivery', 'text', '', '')
    for (let i = 1; i < 20; i++) {
      await capped.bond.connect(capped.buyer).submitEvidence(cappedRoom.roomId, 'text', `note ${i}`, `ref-${i}`)
    }
    expect(await capped.bond.getEvidenceCount(cappedRoom.roomId)).to.equal(20n)
    await expect(capped.bond.connect(capped.buyer).submitEvidence(cappedRoom.roomId, 'text', 'overflow', 'ref-overflow'))
      .to.be.revertedWith('Evidence limit reached')
  })

  it('reverts cleanly when USDC returns false instead of silently continuing', async function () {
    const { bond, usdc, seller, buyer } = await deployFixture()
    const price = parseUsdc(25)
    const fee = await bond.fundingFee(price)

    await bond.connect(seller).createRoom('Safe transfer test', price, 0, joinHash, true, 5)
    await bond.connect(buyer).joinRoom(1, ethers.toUtf8Bytes('JOINCODE'))
    await usdc.mint(buyer.address, price + fee)
    await usdc.connect(buyer).approve(await bond.getAddress(), price + fee)
    await usdc.setFailTransfers(true)

    await expect(bond.connect(buyer).fundRoom(1))
      .to.be.revertedWith('USDC transferFrom failed')
  })

  it('reverts cleanly when payout transfers return false', async function () {
    const releaseCtx = await deployFixture()
    const releaseRoom = await createJoinFundDeliver(releaseCtx)
    await releaseCtx.usdc.setFailTransfers(true)
    await expect(releaseCtx.bond.connect(releaseCtx.buyer).releaseFunds(releaseRoom.roomId))
      .to.be.revertedWith('USDC transfer failed')

    const refundCtx = await deployFixture()
    const refundPrice = parseUsdc(40)
    const refundFee = await refundCtx.bond.fundingFee(refundPrice)
    await refundCtx.bond.connect(refundCtx.seller).createRoom('Refund transfer failure', refundPrice, 0, joinHash, true, 5)
    const refundRoomId = await refundCtx.bond.roomCount()
    await refundCtx.bond.connect(refundCtx.buyer).joinRoom(refundRoomId, ethers.toUtf8Bytes('JOINCODE'))
    await refundCtx.usdc.mint(refundCtx.buyer.address, refundPrice + refundFee)
    await refundCtx.usdc.connect(refundCtx.buyer).approve(await refundCtx.bond.getAddress(), refundPrice + refundFee)
    await refundCtx.bond.connect(refundCtx.buyer).fundRoom(refundRoomId)
    await ethers.provider.send('evm_increaseTime', [6 * 24 * HOUR])
    await ethers.provider.send('evm_mine')
    await refundCtx.usdc.setFailTransfers(true)
    await expect(refundCtx.bond.connect(refundCtx.buyer).buyerRefund(refundRoomId))
      .to.be.revertedWith('USDC transfer failed')

    const resolveCtx = await deployFixture()
    const resolveRoom = await createJoinFundDeliver(resolveCtx)
    await ethers.provider.send('evm_increaseTime', [12 * HOUR + 1])
    await ethers.provider.send('evm_mine')
    await resolveCtx.bond.connect(resolveCtx.seller).escalateNoResponse(resolveRoom.roomId)
    await resolveCtx.usdc.setFailTransfers(true)
    await expect(resolveCtx.bond.connect(resolveCtx.arbiter).arbiterResolve(resolveRoom.roomId, resolveCtx.seller.address))
      .to.be.revertedWith('USDC transfer failed')

    const splitCtx = await deployFixture()
    const splitRoom = await createJoinFundDeliver(splitCtx)
    await ethers.provider.send('evm_increaseTime', [12 * HOUR + 1])
    await ethers.provider.send('evm_mine')
    await splitCtx.bond.connect(splitCtx.seller).escalateNoResponse(splitRoom.roomId)
    await splitCtx.usdc.setFailTransfers(true)
    await expect(splitCtx.bond.connect(splitCtx.arbiter).arbiterSplit(splitRoom.roomId))
      .to.be.revertedWith('USDC transfer failed')
  })

  it('emits admin change events and rejects no-op ownership transfers', async function () {
      const { bond, owner, treasury, buyer } = await deployFixture()

      await expect(bond.connect(owner).transferOwnership(owner.address))
        .to.be.revertedWith('Owner unchanged')

      await expect(bond.connect(owner).setTreasury(buyer.address))
        .to.emit(bond, 'TreasuryUpdated')
        .withArgs(treasury.address, buyer.address)

      await expect(bond.connect(owner).transferOwnership(buyer.address))
        .to.emit(bond, 'OwnershipTransferStarted')
        .withArgs(owner.address, buyer.address)

      // two-step: owner unchanged until the pending owner accepts
      expect(await bond.owner()).to.equal(owner.address)
      expect(await bond.pendingOwner()).to.equal(buyer.address)

      await expect(bond.connect(treasury).acceptOwnership())
        .to.be.revertedWith('Not pending owner')

      await expect(bond.connect(buyer).acceptOwnership())
        .to.emit(bond, 'OwnershipTransferred')
        .withArgs(owner.address, buyer.address)

      expect(await bond.owner()).to.equal(buyer.address)
      expect(await bond.pendingOwner()).to.equal(ethers.ZeroAddress)
    })

    it('lets the owner cancel a pending ownership transfer', async function () {
      const { bond, owner, buyer } = await deployFixture()

      await bond.connect(owner).transferOwnership(buyer.address)
      await expect(bond.connect(owner).cancelOwnershipTransfer())
        .to.emit(bond, 'OwnershipTransferCanceled')
        .withArgs(owner.address, buyer.address)

      await expect(bond.connect(buyer).acceptOwnership())
        .to.be.revertedWith('Not pending owner')
      expect(await bond.owner()).to.equal(owner.address)
    })

    it('blocks the owner from resolving or splitting disputes directly', async function () {
      const ctx = await deployFixture()
      const { bond, owner, buyer, seller } = ctx
      const { roomId } = await createJoinFundDeliver(ctx)
      await bond.connect(buyer).openDispute(roomId, 'not as described', 'text', '', '')

      await expect(bond.connect(owner).arbiterResolve(roomId, seller.address))
        .to.be.revertedWith('Not authorized')
      await expect(bond.connect(owner).arbiterSplit(roomId))
        .to.be.revertedWith('Not authorized')
    })

    it('rejects deploying with arbiter equal to treasury', async function () {
      const [_, treasuryAcct] = await ethers.getSigners()
      const MockUSDC = await ethers.getContractFactory('MockUSDC')
      const usdc = await MockUSDC.deploy()
      const BOND = await ethers.getContractFactory('BOND')
      await expect(
        BOND.deploy(await usdc.getAddress(), treasuryAcct.address, treasuryAcct.address, 'BOND Arbiter'),
      ).to.be.revertedWith('Arbiter must differ from treasury')
    })

    it('sets delivery deadline from fund time, not create time', async function () {
      const { bond, usdc, seller, buyer } = await deployFixture()
      const price = parseUsdc(10)
      const fee = await bond.fundingFee(price)
      const deliveryDays = 5

      await bond.connect(seller).createRoom('Deadline from fund', price, 0, joinHash, true, deliveryDays)
      const roomId = await bond.roomCount()
      let room = await bond.rooms(roomId)
      expect(room.deliveryDeadline).to.equal(0n)
      expect(room.fundedAt).to.equal(0n)
      expect(room.deliveryDays).to.equal(BigInt(deliveryDays))

      await bond.connect(buyer).joinRoom(roomId, ethers.toUtf8Bytes('JOINCODE'))

            // Wait inside fund window (FUND_DL = 30 min) so join→fund still valid
            await ethers.provider.send('evm_increaseTime', [10 * 60])
            await ethers.provider.send('evm_mine')

            await usdc.mint(buyer.address, price + fee)
            await usdc.connect(buyer).approve(await bond.getAddress(), price + fee)
            await bond.connect(buyer).fundRoom(roomId)

            room = await bond.rooms(roomId)
            expect(room.fundedAt).to.be.gt(0n)
            expect(room.deliveryDeadline).to.equal(room.fundedAt + BigInt(deliveryDays * 24 * HOUR))

            // 2 days after fund — still within 5-day delivery window
            await ethers.provider.send('evm_increaseTime', [2 * 24 * HOUR])
            await ethers.provider.send('evm_mine')
            await expect(bond.connect(buyer).buyerRefund(roomId)).to.be.revertedWith('Deadline not passed')

            // Full 5 days after fund
            await ethers.provider.send('evm_increaseTime', [3 * 24 * HOUR + 1])
            await ethers.provider.send('evm_mine')
            await expect(bond.connect(buyer).buyerRefund(roomId)).to.emit(bond, 'RoomRefunded')
          })

          it('guards deliver and dispute paths with nonReentrant', async function () {
            const ctx = await deployFixture()
            const { bond, seller, buyer } = ctx
            const { roomId } = await createJoinFundDeliver(ctx)
            await expect(bond.connect(buyer).openDispute(roomId, 'bad item', 'text', 'desc', 'ref-1'))
              .to.emit(bond, 'RoomDisputed')
            await expect(bond.connect(seller).submitEvidence(roomId, 'text', 'seller note', 'ref-s'))
              .to.emit(bond, 'EvidenceSubmitted')
          })
      })
