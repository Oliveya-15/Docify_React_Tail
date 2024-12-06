import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

            {/*-----Left Section-----*/}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Discover top doctors, book appointments, and manage your health effortlessly. Our platform connects you with trusted specialists to ensure quality care for your well-being. Your health, simplified.</p>
            </div>

            
            {/*-----Center Section-----*/}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            
            {/*-----Right Section-----*/}
            <div>
                <p className='text-xl font-medium mb-5'>STAY CONNECTED</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-123-456-7890</li>
                    <li>docifyweb15@gmail.com</li>
                </ul>
            </div>
        </div>

        {/*-----Copyright text------*/}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>© Copyright 2024@ Docify - All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer