import { useState, useEffect, createContext } from 'react';
import { contractABI, contractAddress } from '../utils/constants';

import { ethers } from 'ethers';

export const TransactionContext = createContext();

const { ethereum } = window !== undefined && window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const handleChange = (e, name) => {
        if (!e.target.value) return;

        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            try {
                if (!ethereum) return alert('Please install MetaMask');
                const accounts = await ethereum.request({ method: 'eth_accounts' });

                if (accounts.length) {
                    setConnectedAccount(accounts[0]);
                    // getAllTransactions()
                } else {
                    console.log('No accounts found');
                }
            } catch (error) {
                console.log(error);
                throw new Error('No ethereum object.');
            }
        };
        checkIfWalletIsConnected();
    }, []);

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Please install MetaMask');
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setConnectedAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object.');
        }
    };
    return <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, sendTransaction, handleChange, isLoading }}>{children}</TransactionContext.Provider>;
};
