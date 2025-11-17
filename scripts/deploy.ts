import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying CeloSave with UUPS Proxy...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");

  // Deploy the CeloSave contract with UUPS proxy
  const CeloSave = await ethers.getContractFactory("CeloSave");

  console.log("\nDeploying UUPS Proxy and Implementation...");

  const celoSave = await upgrades.deployProxy(
    CeloSave,
    [deployer.address], // Initialize with deployer as admin
    {
      kind: "uups",
      initializer: "initialize",
    }
  );

  await celoSave.waitForDeployment();

  const proxyAddress = await celoSave.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );

  console.log("\n✅ Deployment Successful!");
  console.log("─────────────────────────────────────────");
  console.log("Proxy Address:         ", proxyAddress);
  console.log("Implementation Address:", implementationAddress);
  console.log("Admin Address:         ", deployer.address);
  console.log("─────────────────────────────────────────");

  console.log("\n📝 Roles Granted:");
  console.log("DEFAULT_ADMIN_ROLE →", deployer.address);
  console.log("ADMIN_ROLE        →", deployer.address);
  console.log("PAUSER_ROLE       →", deployer.address);
  console.log("UPGRADER_ROLE     →", deployer.address);

  console.log("\n🔐 Security Features:");
  console.log("✓ AccessControl - Role-based permissions");
  console.log("✓ Pausable      - Emergency pause functionality");
  console.log("✓ Timelock      - 2-day delay for critical operations");
  console.log("✓ UUPS Proxy    - Upgradeable contract pattern");

  // Verification instructions
  console.log("\n📋 Next Steps:");
  console.log("1. Verify the implementation contract:");
  console.log(`   npx hardhat verify --network alfajores ${implementationAddress}`);
  console.log("\n2. Update frontend contract address to:", proxyAddress);
  console.log("\n3. Grant additional roles if needed:");
  console.log(`   await celoSave.grantRole(PAUSER_ROLE, "0x...")`);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    proxy: proxyAddress,
    implementation: implementationAddress,
    admin: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
