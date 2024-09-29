const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("SigneleModule", (m) => {
  const signele = m.contract("Signele", [], {});

  return { signele };
});