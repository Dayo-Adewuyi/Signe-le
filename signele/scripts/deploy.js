// deploy.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const Signele = await ethers.getContractFactory("Signele");

  console.log("Deploying Signele as an upgradeable contract...");

  const signele = await upgrades.deployProxy(Signele, [await getDeployerAddress()], {
    initializer: 'initialize',
  });


  console.log("Signele deployed to:", signele.target);
}

async function getDeployerAddress() {
  const [deployer] = await ethers.getSigners();
  return deployer.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
