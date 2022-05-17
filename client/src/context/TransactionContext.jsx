import { useState, useEffect, createContext } from 'react';
import { contractABI, contractAddress } from '../utils/constants';

import { ethers } from 'ethers';

export const TransactionContext = createContext();

const { ethereum } = window !== undefined && window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log({ provider, signer, trasactionContract });
};

export const TransactionProvider = ({ children }) => {
    
};
