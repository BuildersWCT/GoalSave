// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CeloSave
 * @dev Enhanced savings goal contract with comprehensive security features
 *
 * Security Enhancements:
 * 1. AccessControl - Role-based permissions (ADMIN_ROLE, PAUSER_ROLE, UPGRADER_ROLE)
 * 2. Pausable - Emergency pause functionality for critical operations
 * 3. Timelock - Delays for critical administrative functions
 * 4. UUPS Proxy - Upgradeable contract pattern for future improvements
 */
contract CeloSave is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    // Roles for access control
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Timelock configuration
    uint256 public constant TIMELOCK_DURATION = 2 days;

    struct Goal {
        uint256 id;
        string name;
        address token;
        uint256 target;
        uint256 balance;
        uint256 createdAt;
        uint256 lockUntil;
        bool closed;
        bool archived;
    }

    struct TimelockOperation {
        uint256 timestamp;
        bool executed;
        bytes data;
    }

    // User goals mapping: user address => goal ID => Goal
    mapping(address => mapping(uint256 => Goal)) private goals;

    // User goal count: user address => count
    mapping(address => uint256) private goalCount;

    // Timelock operations: operation hash => TimelockOperation
    mapping(bytes32 => TimelockOperation) public timelockOperations;

    // Events
    event GoalCreated(
        address indexed user,
        uint256 indexed goalId,
        string name,
        address token,
        uint256 target,
        uint256 lockUntil
    );

    event GoalClosed(
        address indexed user,
        uint256 indexed goalId
    );

    event GoalArchived(
        address indexed user,
        uint256 indexed goalId
    );

    event GoalRestored(
        address indexed user,
        uint256 indexed goalId
    );

    event Deposited(
        address indexed user,
        uint256 indexed goalId,
        address token,
        uint256 amount
    );

    event Withdrawn(
        address indexed user,
        uint256 indexed goalId,
        address token,
        uint256 amount,
        address to
    );

    event TimelockOperationScheduled(
        bytes32 indexed operationHash,
        uint256 executeAfter
    );

    event TimelockOperationExecuted(
        bytes32 indexed operationHash
    );

    event TimelockOperationCancelled(
        bytes32 indexed operationHash
    );

    // Custom errors
    error GoalNotFound();
    error GoalAlreadyClosed();
    error GoalStillLocked();
    error InsufficientBalance();
    error InvalidAmount();
    error InvalidToken();
    error InvalidLockPeriod();
    error TransferFailed();
    error OperationNotReady();
    error OperationAlreadyExecuted();
    error OperationNotScheduled();
    error GoalAlreadyArchived();
    error GoalNotArchived();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the contract (replaces constructor for upgradeable contracts)
     * @param _admin Address to be granted admin role
     */
    function initialize(address _admin) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        // Grant roles to admin
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
    }

    /**
     * @dev Create a new savings goal
     * @param name Name of the goal
     * @param token Token address (address(0) for native CELO)
     * @param target Target amount to save
     * @param lockUntil Timestamp until which funds are locked
     * @return goalId The ID of the newly created goal
     */
    function createGoal(
        string memory name,
        address token,
        uint256 target,
        uint256 lockUntil
    ) external whenNotPaused returns (uint256 goalId) {
        if (lockUntil <= block.timestamp) revert InvalidLockPeriod();

        goalId = goalCount[msg.sender];

        goals[msg.sender][goalId] = Goal({
            id: goalId,
            name: name,
            token: token,
            target: target,
            balance: 0,
            createdAt: block.timestamp,
            lockUntil: lockUntil,
            closed: false,
            archived: false
        });

        goalCount[msg.sender]++;

        emit GoalCreated(msg.sender, goalId, name, token, target, lockUntil);
    }

    /**
     * @dev Deposit native CELO to a goal
     * @param goalId ID of the goal
     */
    function depositNative(uint256 goalId)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        if (msg.value == 0) revert InvalidAmount();

        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (goal.closed) revert GoalAlreadyClosed();
        if (goal.token != address(0)) revert InvalidToken();

        goal.balance += msg.value;

        emit Deposited(msg.sender, goalId, address(0), msg.value);
    }

    /**
     * @dev Deposit ERC20 tokens to a goal
     * @param goalId ID of the goal
     * @param amount Amount to deposit
     */
    function depositToken(uint256 goalId, uint256 amount)
        external
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert InvalidAmount();

        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (goal.closed) revert GoalAlreadyClosed();
        if (goal.token == address(0)) revert InvalidToken();

        IERC20(goal.token).safeTransferFrom(msg.sender, address(this), amount);
        goal.balance += amount;

        emit Deposited(msg.sender, goalId, goal.token, amount);
    }

    /**
     * @dev Withdraw funds from a goal
     * @param goalId ID of the goal
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 goalId, uint256 amount)
        external
        whenNotPaused
        nonReentrant
    {
        if (amount == 0) revert InvalidAmount();

        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (goal.closed) revert GoalAlreadyClosed();
        if (block.timestamp < goal.lockUntil) revert GoalStillLocked();
        if (goal.balance < amount) revert InsufficientBalance();

        goal.balance -= amount;

        _transferFunds(goal.token, msg.sender, amount);

        emit Withdrawn(msg.sender, goalId, goal.token, amount, msg.sender);
    }

    /**
     * @dev Withdraw all funds from a goal
     * @param goalId ID of the goal
     */
    function withdrawAll(uint256 goalId)
        external
        whenNotPaused
        nonReentrant
    {
        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (goal.closed) revert GoalAlreadyClosed();
        if (block.timestamp < goal.lockUntil) revert GoalStillLocked();

        uint256 amount = goal.balance;
        if (amount == 0) revert InsufficientBalance();

        goal.balance = 0;

        _transferFunds(goal.token, msg.sender, amount);

        emit Withdrawn(msg.sender, goalId, goal.token, amount, msg.sender);
    }

    /**
     * @dev Close a goal
     * @param goalId ID of the goal
     */
    function closeGoal(uint256 goalId) external whenNotPaused {
        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (goal.closed) revert GoalAlreadyClosed();
        if (block.timestamp < goal.lockUntil) revert GoalStillLocked();

        // Withdraw remaining balance if any
        if (goal.balance > 0) {
            uint256 amount = goal.balance;
            goal.balance = 0;
            _transferFunds(goal.token, msg.sender, amount);
            emit Withdrawn(msg.sender, goalId, goal.token, amount, msg.sender);
        }

        goal.closed = true;

        emit GoalClosed(msg.sender, goalId);
    }

    /**
     * @dev Archive a goal
     * @param goalId ID of the goal
     */
    function archiveGoal(uint256 goalId) external whenNotPaused {
        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (goal.archived) revert GoalAlreadyArchived();

        goal.archived = true;

        emit GoalArchived(msg.sender, goalId);
    }

    /**
     * @dev Restore an archived goal
     * @param goalId ID of the goal
     */
    function restoreGoal(uint256 goalId) external whenNotPaused {
        Goal storage goal = goals[msg.sender][goalId];
        if (goal.createdAt == 0) revert GoalNotFound();
        if (!goal.archived) revert GoalNotArchived();

        goal.archived = false;

        emit GoalRestored(msg.sender, goalId);
    }

    /**
     * @dev Get all goals for the caller
     * @return Array of Goal structs
     */
    function getMyGoals() external view returns (Goal[] memory) {
        uint256 count = goalCount[msg.sender];
        Goal[] memory userGoals = new Goal[](count);

        for (uint256 i = 0; i < count; i++) {
            userGoals[i] = goals[msg.sender][i];
        }

        return userGoals;
    }

    /**
     * @dev Get a specific goal
     * @param user User address
     * @param goalId Goal ID
     * @return id The goal ID
     * @return name The goal name
     * @return token The token address
     * @return target The target amount
     * @return balance The current balance
     * @return createdAt The creation timestamp
     * @return lockUntil The lock until timestamp
     * @return closed Whether the goal is closed
     * @return archived Whether the goal is archived
     */
    function getGoal(address user, uint256 goalId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            address token,
            uint256 target,
            uint256 balance,
            uint256 createdAt,
            uint256 lockUntil,
            bool closed,
            bool archived
        )
    {
        Goal memory goal = goals[user][goalId];
        return (
            goal.id,
            goal.name,
            goal.token,
            goal.target,
            goal.balance,
            goal.createdAt,
            goal.lockUntil,
            goal.closed,
            goal.archived
        );
    }

    /**
     * @dev Get goal count for a user
     * @param user User address
     * @return Number of goals
     */
    function getGoalsCount(address user) external view returns (uint256) {
        return goalCount[user];
    }

    // ========== TIMELOCK FUNCTIONS ==========

    /**
     * @dev Schedule a timelocked operation
     * @param operationHash Unique hash for the operation
     * @param data Encoded operation data
     */
    function scheduleOperation(bytes32 operationHash, bytes memory data)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (timelockOperations[operationHash].timestamp != 0) {
            revert OperationAlreadyExecuted();
        }

        uint256 executeAfter = block.timestamp + TIMELOCK_DURATION;

        timelockOperations[operationHash] = TimelockOperation({
            timestamp: executeAfter,
            executed: false,
            data: data
        });

        emit TimelockOperationScheduled(operationHash, executeAfter);
    }

    /**
     * @dev Execute a timelocked operation
     * @param operationHash Hash of the operation to execute
     */
    function executeOperation(bytes32 operationHash)
        external
        onlyRole(ADMIN_ROLE)
    {
        TimelockOperation storage operation = timelockOperations[operationHash];

        if (operation.timestamp == 0) revert OperationNotScheduled();
        if (operation.executed) revert OperationAlreadyExecuted();
        if (block.timestamp < operation.timestamp) revert OperationNotReady();

        operation.executed = true;

        emit TimelockOperationExecuted(operationHash);
    }

    /**
     * @dev Cancel a scheduled operation
     * @param operationHash Hash of the operation to cancel
     */
    function cancelOperation(bytes32 operationHash)
        external
        onlyRole(ADMIN_ROLE)
    {
        TimelockOperation storage operation = timelockOperations[operationHash];

        if (operation.timestamp == 0) revert OperationNotScheduled();
        if (operation.executed) revert OperationAlreadyExecuted();

        delete timelockOperations[operationHash];

        emit TimelockOperationCancelled(operationHash);
    }

    // ========== PAUSABLE FUNCTIONS ==========

    /**
     * @dev Pause the contract (emergency function)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ========== UUPS UPGRADE FUNCTIONS ==========

    /**
     * @dev Authorize upgrade to new implementation (UUPS requirement)
     * @param newImplementation Address of new implementation contract
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // ========== INTERNAL FUNCTIONS ==========

    /**
     * @dev Internal function to transfer funds (native or ERC20)
     * @param token Token address (address(0) for native)
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function _transferFunds(
        address token,
        address to,
        uint256 amount
    ) private {
        if (token == address(0)) {
            // Transfer native CELO
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            // Transfer ERC20 tokens
            IERC20(token).safeTransfer(to, amount);
        }
    }

    /**
     * @dev Emergency withdraw function (only admin, requires timelock)
     * @param token Token address (address(0) for native)
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) whenPaused {
        bytes32 operationHash = keccak256(
            abi.encodePacked("emergencyWithdraw", token, to, amount, block.timestamp)
        );

        TimelockOperation storage operation = timelockOperations[operationHash];
        if (operation.timestamp == 0) revert OperationNotScheduled();
        if (operation.executed) revert OperationAlreadyExecuted();
        if (block.timestamp < operation.timestamp) revert OperationNotReady();

        operation.executed = true;
        _transferFunds(token, to, amount);
    }
}
