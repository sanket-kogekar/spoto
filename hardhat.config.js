require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 40,
      },
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/AvtH9M05438uh_VjPsLOYN9PJ07c4Dxl",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};