import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {

    const navigate = useNavigate();

    const { token, setToken, userData } = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            if (window.innerWidth <= 768) {
                setShowMenu(false);
            }
            navigate(`/search?query=${searchTerm.trim()}`);
        }
    };

    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }


    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctalk'>
                    <li className='py-1'>DOCTALK</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
                <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    spellCheck={false} // <== add this line
                    className="pl-10 py-2 px-4 border border-gray-400 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 text-primary"
                    style={{ fontSize: '18px' }}
                />
                <button type="submit" className="hidden">Search</button> {/* <== Add this */}
            </form>

            <div className='flex items-center gap-4'>
                {
                    token && userData
                        ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={userData.image} alt="" />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appoinments</p>
                                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
                }
                <div className='flex items-center gap-3 md:hidden'>
                    {
                        !token && !userData && (
                            <button onClick={() => navigate('/login')} className='bg-primary text-white px-5 py-2 rounded-full font-light'>
                                Create account
                            </button>
                        )
                    }
                    <img onClick={() => setShowMenu(true)} className='w-6' src={assets.menu_icon} alt="" />
                </div>

                {/*--------Mobile Menu--------*/}
                <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'}  md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                    <div className='flex items-center justify-between px-5 py-6'>
                        <img className='w-36' src={assets.logo} alt="" />
                        <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
                    </div>

                    {/* Mobile Search Bar */}
                    <form onSubmit={handleSearch} className="relative flex items-center w-full">
                        <input
                            type="text"
                            placeholder="  Search doctors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            spellCheck={false} // <== add this line
                            className="pl-10 py-2 px-4 border border-gray-400 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-6 text-primary"
                            style={{ fontSize: '18px' }}
                        />
                        <button type="submit" className="hidden">Search</button> {/* <== Add this */}
                    </form>
                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/doctalk'><p className='px-4 py-2 rounded inline-block'>Doctalk</p></NavLink>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
