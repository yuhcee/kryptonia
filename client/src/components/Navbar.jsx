import { useState } from 'react';

import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../../images/logo.png';
import useClickOutside from '../hooks/useClickOutSide';

const NavbarListItem = ({ title, classProps }) => <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
const NavItems = ['Exchange', 'Market', 'Tutorials', 'Wallets'];

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const ref = useClickOutside(() => {
        setToggleMenu(false);
    });
    return (
        <nav className="w-full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={logo} alt="krypt-logo" className="w-32 cursor-pointer" />
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {NavItems.map((item, index) => (
                    <NavbarListItem key={item + index} title={item} />
                ))}
                <li className="bg-[#2952e3] text-white cursor-pointer py-2 px-7 rounded-full mx-4 hover:bg-[#2946bd]">Login</li>
            </ul>
            <div ref={ref} className="flex relative">
                {toggleMenu ? (
                    <AiOutlineClose fontSize={28} className="text-white md:hidden  cursor-pointer" onClick={() => setToggleMenu(false)} />
                ) : (
                    <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
                )}
                {toggleMenu && (
                    <ul className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hiden list-none flex flex-col justify-start items-end rounded-sm blue-glassmorphism text-white animate-slide-in">
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose fontSize={40} className="ml-2 bg-[#3e5ff5] p-1 rounded-sm font-bold" onClick={() => setToggleMenu(false)} />
                        </li>
                        {NavItems.map((item, index) => (
                            <NavbarListItem key={item + index} title={item} classProps={'my-2 text-lg font-semibold'} />
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
