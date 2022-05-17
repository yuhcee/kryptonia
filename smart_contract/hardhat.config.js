require('@nomiclabs/hardhat-waffle');

const url = 'https://eth-ropsten.alchemyapi.io/v2/VvHLuE6xlZaK3YgLwBxN2AHByv_fg7yR';

module.exports = {
    solidity: '0.8.4',
    networks: {
        ropsten: {
            url,
            accounts: ['02744240b911feaacc4d4eea770d8d3a0366883933a0667d3859f6cc78863c77'],
        },
    },
};
