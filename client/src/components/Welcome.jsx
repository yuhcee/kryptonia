import { useContext, useEffect, useState } from 'react';

import { AiFillPlayCircle } from 'react-icons/ai';
import { SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import { IoIosEyeOff, IoIosEye } from 'react-icons/io';

import { TransactionContext } from '../context/TransactionContext';

import { Loader } from '.';
import { shortenAddress } from '../utils/shortenAddress';

const companyCommonStyles = 'min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white';

const Input = ({ placeholder, name, handleChange, type, value }) => (
    <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={(e) => handleChange(e, name)}
        step={'0.0001'}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

const Welcome = () => {
    const { connectWallet, connectedAccount, formData, sendTransaction, handleChange, isLoading, getBalance, balance } = useContext(TransactionContext);
    const [viewBalance, setViewBalance] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { addressTo, keyword, message, amount } = formData;
        if (!addressTo || !keyword || !message || !amount) return;

        sendTransaction();
    };
    console.log(balance);
    
    useEffect(()=> {
        getBalance()
    })

    return (
        <div className="flex p-2 mf:flex-row flex-col w-full justify-center items-center">
            <div className="flex flex-col flex-1 items-center justify-center md:p-20 py-12 px-4">
                <div className="flex justify-start items-start flex-col mf:mr-10">
                    <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                        Send Crypto <br />
                        across the world
                    </h1>
                    <p className="text-left mt-5 text-xl text-white font-light md:w-9/12 w-11/12 text-base">Explore the crypto world. Buy and sell cryptocurrencies easily online on Krypto.</p>
                    {!connectedAccount && (
                        <button className="flex flex-row justify-center items-center my-5 bg-[#2952e3] w-full p-3 rounded-full cursor-pointer hover:bg-[#2546bd]" type="button" onClick={connectWallet}>
                            <AiFillPlayCircle className="text-white mr-2" />
                            <p className="font-semibold text-white text-base">Connect Wallet</p>
                        </button>
                    )}

                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${companyCommonStyles}`}> Reliability</div>
                        <div className={`${companyCommonStyles}`}> Security</div>
                        <div className={`rounded-tr-2xl ${companyCommonStyles}`}> Ethereum</div>
                        <div className={`rounded-bl-2xl ${companyCommonStyles}`}> Web 3.0</div>
                        <div className={`${companyCommonStyles}`}> Low Fees</div>
                        <div className={`rounded-br-2xl ${companyCommonStyles}`}> BlockChain</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 items-center justify-center p-10 w-full mf:mt-0 mt-10">
                <div className="p-3 flex justify-end items-start flex-col font-semibold rounded-xl h-48 sm:w-80 w-full my-5 eth-card white-glassmorphism">
                    <div className="flex justify-between flex-col w-full h-full">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                                <SiEthereum fontSize={24} color={'#fff'} />
                            </div>
                            <BsInfoCircle fontSize={20} color="#fff" />
                        </div>
                        <div>
                            <p className="font-semi-bold text-lg mt-1 text-white">{viewBalance && balance}</p>

                            {viewBalance ? (
                                <div className="font-light flex items-center text-lg text-white">
                                    Hide Balance
                                    <IoIosEyeOff
                                        className="ml-2"
                                        onClick={() => {
                                            setViewBalance(false);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="font-light flex items-center text-lg text-white">
                                    View Balance
                                    <IoIosEye
                                        className="ml-2"
                                        onClick={() => 
                                            setViewBalance(true)
                                        }
                                    />
                                </div>
                            )}
                            <p className="font-light text-lg text-white">{shortenAddress(connectedAccount)}</p>
                            <p className="font-semi-bold text-lg mt-1 text-white">Ethereum</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                    <Input placeholder={'Address To'} name={'addressTo'} type="text" handleChange={handleChange} />
                    <Input placeholder={'Amount (ETH)'} name={'amount'} type="number" handleChange={handleChange} />
                    <Input placeholder={'Keyword (Gif)'} name={'keyword'} type="text" handleChange={handleChange} />
                    <Input placeholder={'Enter Message'} name={'message'} type="text" handleChange={handleChange} />

                    <div className="h-[1px] w-full bg-gray-400 my-2"></div>

                    {false ? (
                        <Loader />
                    ) : (
                        <button type="button" onClick={handleSubmit} className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7e] rounded-full cursor-pointer">
                            Send Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Welcome;
