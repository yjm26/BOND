// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract BOND {
    // ─── State ───
    address public owner;
    address public pendingOwner;
    IERC20 public immutable usdc;
    address public treasury;
    address public arbiter;
    string public arbiterName;
    mapping(address => bool) public isArbiter;
    mapping(address => string) public arbiterDisplayName;
    bool private locked;

    uint256 public roomCount;
    mapping(uint256 => Room) public rooms;
    mapping(address => uint256) public activeRooms;

    // Evidence
    struct Evidence {
        address submitter;
        string evidenceType;
        string description;
        string evidenceRef;
        uint256 timestamp;
    }
    mapping(uint256 => Evidence[]) public roomEvidence;

    // Mutual Cancel
    mapping(uint256 => mapping(address => bool)) public mutualCancelApproved;

    // Reputation
    mapping(address => uint256) public successCount;
    mapping(address => uint256) public disputeCount;
    mapping(address => uint256) public refundedCount;

    // ─── Constants ───
    uint256 public constant FUND_TAX_BPS = 100;        // 1%
    uint256 public constant ARBITER_FEE_BPS = 500;     // 5%
    uint256 public constant BPS_DENOM = 10000;
    uint256 public constant MAX_ACTIVE = 3;
    uint256 public constant JOIN_DL = 1 days;
    uint256 public constant FUND_DL = 30 minutes;
    uint256 public constant MIN_DELIVERY_DAYS = 1;
    uint256 public constant MAX_DELIVERY_DAYS = 90;
    uint256 public constant MAX_ITEM_BYTES = 160;
    uint256 public constant MAX_ARBITER_NAME_BYTES = 64;
    uint256 public constant MAX_REASON_BYTES = 500;
    uint256 public constant MAX_EVIDENCE_TYPE_BYTES = 48;
    uint256 public constant MAX_EVIDENCE_DESC_BYTES = 500;
    uint256 public constant MAX_EVIDENCE_REF_BYTES = 300;
    uint256 public constant MAX_EVIDENCE_PER_ROOM = 20;

    // Buyer can settle or dispute immediately after delivery.
    // Seller can escalate to arbiter only after this short response buffer.
    uint256 public constant RESPONSE_BUFFER = 12 hours;

    // ─── Enums ───
    enum State {
        Created,    // 0
        Joined,     // 1
        Funded,     // 2
        Delivered,  // 3
        Released,   // 4
        Disputed,   // 5
        Refunded,   // 6
        Expired,    // 7
        Cancelled   // 8
    }

    // ─── Structs ───
    struct Room {
            address creator;
            address counterparty;
            bool creatorIsSeller;
            string itemDescription;
            uint256 priceUSD;
            uint256 collateralAmount;
            uint32 createdAt;
            uint32 joinedAt;
            uint32 fundedAt;           // set on fundRoom
            uint32 deliveredAt;
            uint32 disputedAt;
            uint32 deliveryDays;       // 1–90, chosen at create
            uint32 deliveryDeadline;   // set on fund: fundedAt + deliveryDays
            uint32 confirmDeadline;    // arbiter fallback opens at this timestamp after delivery
            State state;
            uint256 fundedAmount;
            uint256 platformFee;
            bytes32 deliveryProofHash;
            bytes32 joinCodeHash;
        }

        // ─── Events ───
        event RoomCreated(
            uint256 indexed id,
            address indexed creator,
            string item,
            uint256 price,
            uint256 collateral,
            bool creatorIsSeller,
            uint32 deliveryDays
        );
    event RoomJoined(uint256 indexed id, address indexed who);
    event RoomLeft(uint256 indexed id, address indexed who);
    event RoomFunded(uint256 indexed id, uint256 amount, uint256 fee, uint256 totalPaid);
    event RoomDelivered(uint256 indexed id, bytes32 proof);
    event RoomReleased(uint256 indexed id, uint256 amount, uint256 collateral);
    event RoomDisputed(uint256 indexed id, string reason);
    event RoomRefunded(uint256 indexed id, uint256 amount, uint256 collateral);
    event RoomExpired(uint256 indexed id);
    event RoomCancelled(uint256 indexed id, address indexed by);
    event DisputeResolved(uint256 indexed id, address indexed winner, uint256 amount);
    event MutualCancelRequested(uint256 indexed id, address indexed by);
    event MutualCancelExecuted(uint256 indexed id);
    event MutualCancelRevoked(uint256 indexed id, address indexed by);
    event ArbiterAdded(address indexed account, string name);
    event ArbiterRemoved(address indexed account);
    event EvidenceSubmitted(
        uint256 indexed roomId,
        address indexed submitter,
        string evidenceType,
        string description,
        string evidenceRef
    );
    event EscalatedNoResponse(uint256 indexed id, uint32 confirmDeadline);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferStarted(address indexed currentOwner, address indexed pendingOwner);
    event OwnershipTransferCanceled(address indexed currentOwner, address indexed canceledPending);
    event TreasuryUpdated(address indexed previousTreasury, address indexed newTreasury);

    // ─── Modifiers ───
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyArbiter() {
        require(isArbiter[msg.sender], "Not authorized");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // ─── Constructor ───
    constructor(
        address _usdc,
        address _treasury,
        address _arbiter,
        string memory _arbiterName
    ) {
        require(_usdc != address(0), "Bad USDC");
        require(_treasury != address(0), "Bad treasury");
        require(_arbiter != address(0), "Bad arbiter");
        require(_arbiter != _treasury, "Arbiter must differ from treasury");
        require(bytes(_arbiterName).length <= MAX_ARBITER_NAME_BYTES, "Arbiter name too long");
        owner = msg.sender;
        usdc = IERC20(_usdc);
        treasury = _treasury;
        arbiter = _arbiter;
        arbiterName = _arbiterName;
        isArbiter[_arbiter] = true;
        arbiterDisplayName[_arbiter] = _arbiterName;
        emit ArbiterAdded(_arbiter, _arbiterName);
    }

    // ─── Admin ───
    function setTreasury(address _t) external onlyOwner {
        require(_t != address(0), "Bad treasury");
        address previous = treasury;
        treasury = _t;
        emit TreasuryUpdated(previous, _t);
    }

    function setArbiter(address _a, string memory _name) external onlyOwner {
        require(_a != address(0), "Bad arbiter");
        require(bytes(_name).length <= MAX_ARBITER_NAME_BYTES, "Arbiter name too long");
        address previous = arbiter;
        if (previous != address(0) && previous != _a) {
            isArbiter[previous] = false;
            arbiterDisplayName[previous] = "";
            emit ArbiterRemoved(previous);
        }
        arbiter = _a;
        arbiterName = _name;
        isArbiter[_a] = true;
        arbiterDisplayName[_a] = _name;
        emit ArbiterAdded(_a, _name);
    }

    function addArbiter(address _account, string memory _name) external onlyOwner {
        require(_account != address(0), "Bad arbiter");
        require(bytes(_name).length <= MAX_ARBITER_NAME_BYTES, "Arbiter name too long");
        isArbiter[_account] = true;
        arbiterDisplayName[_account] = _name;
        emit ArbiterAdded(_account, _name);
    }

    function removeArbiter(address _account) external onlyOwner {
        require(_account != address(0), "Bad arbiter");
        isArbiter[_account] = false;
        arbiterDisplayName[_account] = "";
        emit ArbiterRemoved(_account);
    }

    function transferOwnership(address _new) external onlyOwner {
        require(_new != address(0), "Bad owner");
        require(_new != owner, "Owner unchanged");
        pendingOwner = _new;
        emit OwnershipTransferStarted(owner, _new);
    }

    function acceptOwnership() external {
        require(msg.sender == pendingOwner, "Not pending owner");
        address previous = owner;
        owner = msg.sender;
        pendingOwner = address(0);
        emit OwnershipTransferred(previous, msg.sender);
    }

    function cancelOwnershipTransfer() external onlyOwner {
        require(pendingOwner != address(0), "No pending transfer");
        emit OwnershipTransferCanceled(owner, pendingOwner);
        pendingOwner = address(0);
    }

    // ─── Helpers ───
    function _seller(Room storage r) internal view returns (address) {
        return r.creatorIsSeller ? r.creator : r.counterparty;
    }

    function _buyer(Room storage r) internal view returns (address) {
        return r.creatorIsSeller ? r.counterparty : r.creator;
    }

    function _isParticipant(Room storage r) internal view returns (bool) {
        return msg.sender == r.creator || msg.sender == r.counterparty;
    }

    function _clearMutualCancelApprovals(uint256 _roomId, address _creator, address _counterparty) internal {
        mutualCancelApproved[_roomId][_creator] = false;
        if (_counterparty != address(0)) {
            mutualCancelApproved[_roomId][_counterparty] = false;
        }
    }

    function fundingFee(uint256 _price) public pure returns (uint256) {
        return (_price * FUND_TAX_BPS) / BPS_DENOM;
    }

    function _safeTransfer(address to, uint256 amount) internal {
        require(usdc.transfer(to, amount), "USDC transfer failed");
    }

    function _safeTransferFrom(address from, address to, uint256 amount) internal {
        require(usdc.transferFrom(from, to, amount), "USDC transferFrom failed");
    }

    // ─── Reputation ───
    function collateralMultiplier(address sellerAccount) external view returns (uint256) {
        if (refundedCount[sellerAccount] > 0) return 150;
        if (successCount[sellerAccount] >= 10) return 50;
        if (successCount[sellerAccount] >= 3) return 75;
        return 100;
    }

    // ─── Create Room ───
    function createRoom(
        string calldata _item,
        uint256 _price,
        uint256 _collateral,
        bytes32 _joinCodeHash,
        bool _creatorIsSeller,
        uint32 _deliveryDays
    ) external nonReentrant {
        require(bytes(_item).length > 0, "Empty item");
        require(bytes(_item).length <= MAX_ITEM_BYTES, "Item too long");
        require(_price > 0, "Zero price");
        require(_deliveryDays >= MIN_DELIVERY_DAYS && _deliveryDays <= MAX_DELIVERY_DAYS, "Bad deliveryDays");
        require(activeRooms[msg.sender] < MAX_ACTIVE, "Max active rooms reached");

        uint256 id = ++roomCount;
        uint32 now32 = uint32(block.timestamp);

        rooms[id] = Room({
                    creator: msg.sender,
                    counterparty: address(0),
                    creatorIsSeller: _creatorIsSeller,
                    itemDescription: _item,
                    priceUSD: _price,
                    collateralAmount: _collateral,
                    createdAt: now32,
                    joinedAt: 0,
                    fundedAt: 0,
                    deliveredAt: 0,
                    disputedAt: 0,
                    deliveryDays: _deliveryDays,
                    deliveryDeadline: 0, // set when buyer funds
                    confirmDeadline: 0,
                    state: State.Created,
                    fundedAmount: 0,
                    platformFee: 0,
                    deliveryProofHash: bytes32(0),
                    joinCodeHash: _joinCodeHash
                });

                activeRooms[msg.sender]++;

                if (_creatorIsSeller && _collateral > 0) {
                    _safeTransferFrom(msg.sender, address(this), _collateral);
                }

                emit RoomCreated(
                    id,
                    msg.sender,
                    _item,
                    _price,
                    _collateral,
                    _creatorIsSeller,
                    _deliveryDays
                );
            }

    // ─── Join Room ───
    function joinRoom(uint256 _roomId, bytes calldata _joinCode) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.creator != address(0), "Room not found");
        require(r.state == State.Created, "Not open for join");
        require(block.timestamp <= r.createdAt + JOIN_DL, "Join window expired");
        require(msg.sender != r.creator, "Creator cannot join");
        require(r.counterparty == address(0), "Already joined");
        require(verifyJoinCode(_roomId, _joinCode), "Invalid join code");
        require(activeRooms[msg.sender] < MAX_ACTIVE, "Max active rooms reached");

        r.counterparty = msg.sender;
        r.joinedAt = uint32(block.timestamp);
        r.state = State.Joined;
        activeRooms[msg.sender]++;

        if (!r.creatorIsSeller && r.collateralAmount > 0) {
            _safeTransferFrom(msg.sender, address(this), r.collateralAmount);
        }

        emit RoomJoined(_roomId, msg.sender);
    }

    // ─── Leave Room (counterparty, before funding) ───
    function leaveRoom(uint256 _roomId) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.creator != address(0), "Room not found");
        require(r.state == State.Joined, "Not joined");
        require(msg.sender == r.counterparty, "Only counterparty");

        uint256 collateralRefund = (!r.creatorIsSeller && r.collateralAmount > 0) ? r.collateralAmount : 0;
        address leaving = r.counterparty;

        r.counterparty = address(0);
        r.joinedAt = 0;
        r.state = State.Created;

        if (activeRooms[leaving] > 0) activeRooms[leaving]--;
        _clearMutualCancelApprovals(_roomId, r.creator, leaving);

        if (collateralRefund > 0) {
            _safeTransfer(leaving, collateralRefund);
        }

        emit RoomLeft(_roomId, leaving);
    }

    // ─── Fund Room ───
    function fundRoom(uint256 _roomId) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(r.state == State.Joined, "Not joinable");
            require(block.timestamp <= r.joinedAt + FUND_DL, "Fund window expired");

            address buyer = _buyer(r);
            require(msg.sender == buyer, "Only buyer can fund");

            uint256 fee = fundingFee(r.priceUSD);
            uint256 totalPaid = r.priceUSD + fee;

            _safeTransferFrom(msg.sender, address(this), totalPaid);

            uint32 now32 = uint32(block.timestamp);
            r.fundedAmount = r.priceUSD;
            r.platformFee = fee;
            r.fundedAt = now32;
            r.deliveryDeadline = now32 + (r.deliveryDays * 1 days);
            r.state = State.Funded;

            emit RoomFunded(_roomId, r.priceUSD, fee, totalPaid);
        }

        // ─── Mark Delivered ───
        function markDelivered(uint256 _roomId, bytes32 _proofHash) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(r.state == State.Funded, "Not funded");
            require(block.timestamp <= r.deliveryDeadline, "Delivery deadline passed");
            require(msg.sender == _seller(r), "Only seller");

            r.deliveryProofHash = _proofHash;
            r.deliveredAt = uint32(block.timestamp);
            r.confirmDeadline = uint32(block.timestamp + RESPONSE_BUFFER);
            r.state = State.Delivered;

            emit RoomDelivered(_roomId, _proofHash);
        }

    // ─── Release Funds (buyer confirms) ───
    function releaseFunds(uint256 _roomId) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.state == State.Delivered, "Not delivered");
        require(msg.sender == _buyer(r), "Only buyer can release");
        _release(_roomId, r);
    }

    function _release(uint256 _roomId, Room storage r) internal {
        address seller = _seller(r);

        uint256 payout = r.fundedAmount + r.collateralAmount;
        uint256 releasedAmount = r.fundedAmount;
        uint256 releasedCollateral = r.collateralAmount;

        _closeRoom(_roomId, r);
        r.state = State.Released;
        successCount[seller]++;

        if (r.platformFee > 0) {
            _safeTransfer(treasury, r.platformFee);
        }

        if (payout > 0) {
            _safeTransfer(seller, payout);
        }

        emit RoomReleased(_roomId, releasedAmount, releasedCollateral);
    }

    // ─── Escalate No Response (seller calls when buyer ghosts) ───
    function escalateNoResponse(uint256 _roomId) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(r.state == State.Delivered, "Not delivered");
            require(msg.sender == _seller(r), "Only seller");
            require(block.timestamp > r.confirmDeadline, "Response buffer still open");

            r.state = State.Disputed;
            r.disputedAt = uint32(block.timestamp);

            disputeCount[_seller(r)]++;
            disputeCount[_buyer(r)]++;

            emit RoomDisputed(_roomId, "Buyer did not settle or dispute after delivery");
            emit EscalatedNoResponse(_roomId, r.confirmDeadline);
        }

        // ─── Dispute (with reason & evidence) ───
        function openDispute(
            uint256 _roomId,
            string calldata _reason,
            string calldata _evidenceType,
            string calldata _evidenceDesc,
            string calldata _evidenceRef
        ) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(r.state == State.Delivered, "Not delivered");
            require(msg.sender == _buyer(r), "Only buyer can dispute");
            require(bytes(_reason).length > 0, "Reason required");
            require(bytes(_reason).length <= MAX_REASON_BYTES, "Reason too long");

            r.state = State.Disputed;
            r.disputedAt = uint32(block.timestamp);

            disputeCount[_seller(r)]++;
            disputeCount[_buyer(r)]++;

            _submitEvidence(_roomId, _evidenceType, _evidenceDesc, _evidenceRef);

            emit RoomDisputed(_roomId, _reason);
        }

        // ─── Submit Evidence (after dispute, by either party) ───
        function submitEvidence(
            uint256 _roomId,
            string calldata _evidenceType,
            string calldata _description,
            string calldata _evidenceRef
        ) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(r.state == State.Disputed, "Not disputed");
            require(_isParticipant(r), "Only participant can submit evidence");
            require(bytes(_evidenceRef).length > 0, "Evidence ref required");

            _submitEvidence(_roomId, _evidenceType, _description, _evidenceRef);
        }

    function _submitEvidence(
        uint256 _roomId,
        string calldata _evidenceType,
        string calldata _description,
        string calldata _evidenceRef
    ) internal {
        require(bytes(_evidenceType).length <= MAX_EVIDENCE_TYPE_BYTES, "Evidence type too long");
        require(bytes(_description).length <= MAX_EVIDENCE_DESC_BYTES, "Evidence desc too long");
        require(bytes(_evidenceRef).length <= MAX_EVIDENCE_REF_BYTES, "Evidence ref too long");
        require(roomEvidence[_roomId].length < MAX_EVIDENCE_PER_ROOM, "Evidence limit reached");

        roomEvidence[_roomId].push(Evidence({
            submitter: msg.sender,
            evidenceType: _evidenceType,
            description: _description,
            evidenceRef: _evidenceRef,
            timestamp: block.timestamp
        }));

        emit EvidenceSubmitted(_roomId, msg.sender, _evidenceType, _description, _evidenceRef);
    }

    // ─── View Evidence ───
    function getEvidenceCount(uint256 _roomId) external view returns (uint256) {
        return roomEvidence[_roomId].length;
    }

    function getEvidence(uint256 _roomId, uint256 _index) external view returns (Evidence memory) {
        require(_index < roomEvidence[_roomId].length, "Index out of bounds");
        return roomEvidence[_roomId][_index];
    }

    function getAllEvidence(uint256 _roomId) external view returns (Evidence[] memory) {
        return roomEvidence[_roomId];
    }

    // ─── Buyer Refund (seller failed to deliver) ───
    function buyerRefund(uint256 _roomId) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.state == State.Funded, "Not funded");
        require(block.timestamp > r.deliveryDeadline, "Deadline not passed");
        require(msg.sender == _buyer(r), "Only buyer");

        address buyer = _buyer(r);
        address seller = _seller(r);
        uint256 totalRefund = r.fundedAmount + r.collateralAmount;
        uint256 refundedAmount = r.fundedAmount;
        uint256 refundedCollateral = r.collateralAmount;

        _closeRoom(_roomId, r);
        r.state = State.Refunded;
        refundedCount[seller]++;

        if (r.platformFee > 0) {
            _safeTransfer(treasury, r.platformFee);
        }

        if (totalRefund > 0) {
            _safeTransfer(buyer, totalRefund);
        }

        emit RoomRefunded(_roomId, refundedAmount, refundedCollateral);
    }

    // ─── Arbiter Resolve ───
    function arbiterResolve(uint256 _roomId, address _winner) external onlyArbiter nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.state == State.Disputed, "Not disputed");
        require(_winner == _buyer(r) || _winner == _seller(r), "Invalid winner");

        uint256 total = r.fundedAmount + r.collateralAmount;
        uint256 arbiterFee = (total * ARBITER_FEE_BPS) / BPS_DENOM;
        uint256 net = total - arbiterFee;
        address seller = _seller(r);

        if (_winner == seller) {
            successCount[seller]++;
        } else {
            refundedCount[seller]++;
        }

        _closeRoom(_roomId, r);
        r.state = State.Released;

        if (r.platformFee > 0) _safeTransfer(treasury, r.platformFee);
        if (arbiterFee > 0) _safeTransfer(treasury, arbiterFee);

        if (net > 0) _safeTransfer(_winner, net);

        emit DisputeResolved(_roomId, _winner, net);
    }

    // ─── Arbiter Split ───
    function arbiterSplit(uint256 _roomId) external onlyArbiter nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.state == State.Disputed, "Not disputed");

        uint256 total = r.fundedAmount + r.collateralAmount;
        uint256 arbiterFee = (total * ARBITER_FEE_BPS) / BPS_DENOM;
        uint256 net = total - arbiterFee;
        uint256 half = net / 2;
        address buyer = _buyer(r);
        address seller = _seller(r);

        _closeRoom(_roomId, r);
        r.state = State.Released;

        if (r.platformFee > 0) _safeTransfer(treasury, r.platformFee);
        if (arbiterFee > 0) _safeTransfer(treasury, arbiterFee);

        if (half > 0) {
            _safeTransfer(buyer, half);
            _safeTransfer(seller, net - half);
        }

        emit DisputeResolved(_roomId, address(0), net);
    }

    // ─── Cancel Room (creator, before join) ───
    function cancelRoom(uint256 _roomId) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(r.creator == msg.sender, "Only creator");
        require(r.state == State.Created, "Not cancellable");

        address creator = r.creator;
        uint256 collateralRefund = r.creatorIsSeller ? r.collateralAmount : 0;

        _clearMutualCancelApprovals(_roomId, r.creator, r.counterparty);
        _closeRoom(_roomId, r);
        r.state = State.Cancelled;

        if (collateralRefund > 0) {
            _safeTransfer(creator, collateralRefund);
        }

        emit RoomCancelled(_roomId, msg.sender);
    }

    // ─── Expire Room (anyone, after deadline) ───
    function expireRoom(uint256 _roomId) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(
            r.state == State.Created || r.state == State.Joined,
            "Not expirable"
        );

        if (r.state == State.Created) {
            require(block.timestamp > r.createdAt + JOIN_DL, "Not expired");
        } else {
            require(block.timestamp > r.joinedAt + FUND_DL, "Not expired");
        }

        address refundTo = r.creatorIsSeller ? r.creator : r.counterparty;
        uint256 collateralRefund = r.collateralAmount;

        _clearMutualCancelApprovals(_roomId, r.creator, r.counterparty);
        _closeRoom(_roomId, r);
        r.state = State.Expired;

        if (collateralRefund > 0) {
            _safeTransfer(refundTo, collateralRefund);
        }

        emit RoomExpired(_roomId);
    }

    // ─── Mutual Cancel Request ───
    function requestMutualCancel(uint256 _roomId) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(_isParticipant(r), "Only participant");
            require(
                r.state == State.Joined || r.state == State.Funded || r.state == State.Delivered,
                "Not cancellable"
            );
            require(!mutualCancelApproved[_roomId][msg.sender], "Already requested");

            mutualCancelApproved[_roomId][msg.sender] = true;
            emit MutualCancelRequested(_roomId, msg.sender);
        }

        // ─── Mutual Cancel Revoke ───
        function revokeMutualCancel(uint256 _roomId) external nonReentrant {
            Room storage r = rooms[_roomId];
            require(_isParticipant(r), "Only participant");
            require(mutualCancelApproved[_roomId][msg.sender], "Not requested");

            mutualCancelApproved[_roomId][msg.sender] = false;
            emit MutualCancelRevoked(_roomId, msg.sender);
        }

    function getMutualCancelStatus(uint256 _roomId) external view returns (bool creatorApproved, bool counterpartyApproved) {
        Room storage r = rooms[_roomId];
        require(r.creator != address(0), "Room not found");
        creatorApproved = mutualCancelApproved[_roomId][r.creator];
        counterpartyApproved = r.counterparty != address(0) && mutualCancelApproved[_roomId][r.counterparty];
    }

    // ─── Mutual Cancel Execute ───
    function executeMutualCancel(uint256 _roomId) external nonReentrant {
        Room storage r = rooms[_roomId];
        require(
            r.state == State.Joined || r.state == State.Funded || r.state == State.Delivered,
            "Not cancellable"
        );
        require(
            mutualCancelApproved[_roomId][r.creator] && mutualCancelApproved[_roomId][r.counterparty],
            "Both must approve"
        );

        address buyer = _buyer(r);
        address seller = _seller(r);
        uint256 refundToBuyer = r.fundedAmount + r.platformFee;
        uint256 refundToSeller = r.collateralAmount;

        _clearMutualCancelApprovals(_roomId, r.creator, r.counterparty);
        _closeRoom(_roomId, r);
        r.state = State.Cancelled;

        if (refundToBuyer > 0) {
            _safeTransfer(buyer, refundToBuyer);
        }
        if (refundToSeller > 0) {
            _safeTransfer(seller, refundToSeller);
        }

        emit MutualCancelExecuted(_roomId);
    }

    // ─── Verify Join Code ───
    function verifyJoinCode(uint256 _roomId, bytes calldata _code) public view returns (bool) {
        return keccak256(_code) == rooms[_roomId].joinCodeHash;
    }

    // ─── Close Room ───
    function _closeRoom(uint256, Room storage r) internal {
        if (r.creator != address(0)) {
            if (activeRooms[r.creator] > 0) activeRooms[r.creator]--;
        }
        if (r.counterparty != address(0)) {
            if (activeRooms[r.counterparty] > 0) activeRooms[r.counterparty]--;
        }
    }
}
