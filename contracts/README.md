# CeloSave Smart Contract - Security Enhancements

This document describes the security enhancements implemented in the CeloSave contract as specified in [Issue #1](https://github.com/BuildersWCT/GoalSave/issues/1).

## Security Features

### 1. OpenZeppelin AccessControl ✅

The contract implements role-based access control with four distinct roles:

- **DEFAULT_ADMIN_ROLE**: Manages role assignments and has supreme control
- **ADMIN_ROLE**: Can schedule, execute, and cancel timelocked operations
- **PAUSER_ROLE**: Can pause/unpause the contract in emergencies
- **UPGRADER_ROLE**: Authorized to upgrade the contract implementation

#### Usage Example

```solidity
// Grant pauser role to an address
await celoSave.grantRole(PAUSER_ROLE, "0x123...");

// Revoke a role
await celoSave.revokeRole(PAUSER_ROLE, "0x123...");

// Check if address has role
const hasRole = await celoSave.hasRole(ADMIN_ROLE, "0x123...");
```

### 2. Emergency Pause Functionality ✅

Implements OpenZeppelin's `PausableUpgradeable` to halt critical operations during emergencies.

- **Pausable Functions**: `createGoal`, `depositNative`, `depositToken`, `withdraw`, `withdrawAll`, `closeGoal`
- **View Functions**: Remain accessible when paused

#### Usage Example

```solidity
// Pause the contract (requires PAUSER_ROLE)
await celoSave.pause();

// Unpause the contract
await celoSave.unpause();

// Check if paused
const isPaused = await celoSave.paused();
```

### 3. Timelock for Critical Functions ✅

Implements a 2-day timelock delay for administrative operations to prevent immediate execution of critical changes.

- **Timelock Duration**: 2 days (172,800 seconds)
- **Protected Operations**: Administrative functions, emergency withdrawals
- **Three-Step Process**: Schedule → Wait → Execute

#### Usage Example

```solidity
// Step 1: Schedule an operation
const operationHash = ethers.keccak256(
  ethers.solidityPacked(
    ["string", "address", "uint256"],
    ["emergencyWithdraw", tokenAddress, amount]
  )
);

await celoSave.scheduleOperation(operationHash, encodedData);

// Step 2: Wait for timelock duration (2 days)

// Step 3: Execute the operation
await celoSave.executeOperation(operationHash);

// Cancel if needed
await celoSave.cancelOperation(operationHash);
```

### 4. UUPS Proxy Pattern for Upgrades ✅

Uses OpenZeppelin's UUPS (Universal Upgradeable Proxy Standard) pattern for safe contract upgrades.

- **Upgrade Authorization**: Only addresses with `UPGRADER_ROLE` can upgrade
- **Preserved State**: All user data remains intact after upgrades
- **Gas Efficient**: Lower deployment costs compared to Transparent Proxy

#### Deployment

```bash
# Deploy the upgradeable contract
npx hardhat run scripts/deploy.ts --network alfajores

# Upgrade to new implementation
npx hardhat run scripts/upgrade.ts --network alfajores
```

## Additional Security Features

### ReentrancyGuard
Protects against reentrancy attacks on functions involving fund transfers.

### SafeERC20
Uses OpenZeppelin's `SafeERC20` library for secure token transfers.

### Custom Errors
Gas-efficient custom errors instead of string-based reverts.

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           UUPS Proxy Contract               │
│  (Stores all state, delegates calls)        │
└─────────────────┬───────────────────────────┘
                  │
                  │ delegatecall
                  ▼
┌─────────────────────────────────────────────┐
│      CeloSave Implementation Contract       │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │      AccessControlUpgradeable      │    │
│  │  - DEFAULT_ADMIN_ROLE             │    │
│  │  - ADMIN_ROLE                     │    │
│  │  - PAUSER_ROLE                    │    │
│  │  - UPGRADER_ROLE                  │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │      PausableUpgradeable           │    │
│  │  - pause()                         │    │
│  │  - unpause()                       │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │      Timelock Mechanism            │    │
│  │  - scheduleOperation()             │    │
│  │  - executeOperation()              │    │
│  │  - cancelOperation()               │    │
│  │  - TIMELOCK_DURATION: 2 days      │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │      UUPSUpgradeable               │    │
│  │  - _authorizeUpgrade()             │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │      Core Functionality            │    │
│  │  - createGoal()                    │    │
│  │  - depositNative()                 │    │
│  │  - depositToken()                  │    │
│  │  - withdraw()                      │    │
│  │  - withdrawAll()                   │    │
│  │  - closeGoal()                     │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Deployment Guide

### Prerequisites

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install --save-dev @openzeppelin/contracts @openzeppelin/contracts-upgradeable
npm install --save-dev @openzeppelin/hardhat-upgrades
```

### Environment Setup

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key_here
ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
CELO_RPC=https://forno.celo.org
```

### Deploy to Alfajores Testnet

```bash
npx hardhat run scripts/deploy.ts --network alfajores
```

### Upgrade Contract

```bash
npx hardhat run scripts/upgrade.ts --network alfajores
```

### Verify Contract

```bash
npx hardhat verify --network alfajores <IMPLEMENTATION_ADDRESS>
```

## Testing

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Generate coverage report
npx hardhat coverage
```

## Gas Optimization

The contract includes several gas optimizations:

- Custom errors instead of revert strings
- Efficient storage layout
- ReentrancyGuard only on necessary functions
- Optimized loops in `getMyGoals()`

## Security Considerations

1. **Initial Admin**: The deployer receives all roles initially. Consider distributing roles to different addresses.

2. **Timelock Duration**: 2 days provides a reasonable window for users to react to scheduled changes.

3. **Emergency Pause**: Should only be used in critical situations as it affects all users.

4. **Upgrade Process**: Always test upgrades on testnet before mainnet deployment.

5. **Role Management**: Implement a multi-sig for critical roles in production.

## Events

All state changes emit events for off-chain tracking:

- `GoalCreated`
- `GoalClosed`
- `Deposited`
- `Withdrawn`
- `TimelockOperationScheduled`
- `TimelockOperationExecuted`
- `TimelockOperationCancelled`
- `Paused` (from OpenZeppelin)
- `Unpaused` (from OpenZeppelin)
- `RoleGranted` (from OpenZeppelin)
- `RoleRevoked` (from OpenZeppelin)

## License

MIT
