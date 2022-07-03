import { useState, useEffect, createContext } from 'react';
import { contractABI, contractAddress } from '../utils/constants';

import { ethers } from 'ethers';

export const TransactionContext = createContext();

const { ethereum } = window !== undefined && window;

const createEthereumContract = () => {
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
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState('');

    const handleChange = (e, name) => {
        if (!e.target.value) return;
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const transactionsContract = createEthereumContract();

                const availableTransactions = await transactionsContract.getAllTransactions();

                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex) / 10 ** 18,
                }));

                console.log(structuredTransactions);

                setTransactions(structuredTransactions);
            } else {
                console.log('Ethereum is not present');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert('Please install MetaMask');
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setConnectedAccount(accounts[0]);
                getAllTransactions();
            } else {
                console.log('No accounts found');
            }
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object.');
        }
    };

    const checkIfTransactionsExists = async () => {
        try {
            if (ethereum) {
                const transactionsContract = createEthereumContract();
                const currentTransactionCount = await transactionsContract.getTransactionCount();

                window.localStorage.setItem('transactionCount', currentTransactionCount);
            }
        } catch (error) {
            console.log(error);

            throw new Error('No ethereum object');
        }
    };

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
            if (ethereum) {
                const { addressTo, keyword, message, amount } = formData;
                const transactionContract = createEthereumContract();
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
                const transactionsCount = await transactionsContract.getTransactionCount();

                setTransactionCount(transactionsCount.toNumber());
                window.location.reload();
            } else {
                console.log('No ethereum object');
            }
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
            } else {
                console.log('No balance');
            }
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object.');
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
        getBalance();
    }, [transactionCount]);

    return (
        <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, sendTransaction, handleChange, isLoading, balance, getBalance, transactions }}>
            {children}
        </TransactionContext.Provider>
    );
};
