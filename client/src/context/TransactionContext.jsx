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
    const [balance, setBalance] = useState('');
    console.log(balance);

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
        getBalance();
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

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert('Please install Metamask');
            const { addressTo, keyword, message, amount } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: connectedAccount,
                        to: addressTo,
                        gas: '0x5208', // 2100 GWEI
                        value: parsedAmount._hex,
                    },
                ],
            });

            const transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading -> ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success -> ${transactionHash.hash}`);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object.');
        }
    };

    const getBalance = async () => {
        try {
            if (!ethereum) return alert('Please install MetaMask');
            const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
            if (account) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const balance = await provider.getBalance(account);
                setBalance(ethers.utils.formatEther(balance));
            }else{
                console.log('No balance');
            }
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object.');
        }
    };

    return <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, sendTransaction, handleChange, isLoading, balance, getBalance }}>{children}</TransactionContext.Provider>;
};
