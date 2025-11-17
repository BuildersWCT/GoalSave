import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Upgrading CeloSave contract...");

  const [upgrader] = await ethers.getSigners();
  console.log("Upgrading with account:", upgrader.address);

  // Read the proxy address from deployment info
  const fs = require("fs");
  let proxyAddress: string;

  try {
    const deploymentInfo = JSON.parse(
      fs.readFileSync("deployment-info.json", "utf8")
    );
    proxyAddress = deploymentInfo.proxy;
    console.log("Found proxy address:", proxyAddress);
  } catch (error) {
    console.error("❌ Could not read deployment-info.json");
    console.error("Please provide the proxy address:");
    console.error("PROXY_ADDRESS=0x... npx hardhat run scripts/upgrade.ts");
    process.exit(1);
  }

  // Deploy the new implementation
  const CeloSaveV2 = await ethers.getContractFactory("CeloSave");

  console.log("\n🔄 Upgrading to new implementation...");
  console.log("This will use the timelock mechanism if configured");

  const upgraded = await upgrades.upgradeProxy(proxyAddress, CeloSaveV2);
  await upgraded.waitForDeployment();

  const newImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);

  console.log("\n✅ Upgrade Successful!");
  console.log("─────────────────────────────────────────");
  console.log("Proxy Address:             ", proxyAddress);
  console.log("New Implementation Address:", newImplementationAddress);
  console.log("─────────────────────────────────────────");

  // Update deployment info
  const deploymentInfo = JSON.parse(
    fs.readFileSync("deployment-info.json", "utf8")
  );
  deploymentInfo.implementation = newImplementationAddress;
  deploymentInfo.upgradedAt = new Date().toISOString();

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info updated");
  console.log("\n⚠️  Important:");
  console.log("- The proxy address remains the same");
  console.log("- Frontend does NOT need to be updated");
  console.log("- All user data is preserved");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
