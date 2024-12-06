import React from 'react'
import {assets} from '../assets/assets'

const About = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
        </div>


    <div className='my-10 flex flex-col md:flex-row gap-12'>
      <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>Welcome to Docify, where we transform how you manage your health. Our goal is to simplify booking doctor appointments with an intuitive platform that connects you to top healthcare professionals effortlessly. Enjoy real-time scheduling and a comprehensive list of verified doctors, making your healthcare experience smooth and convenient.</p>
        <p>At Docify, we prioritize your health and time. Our app provides instant access to doctors across various specialties, allowing you to book appointments quickly and easily. Our focus is on ensuring you receive timely and quality care, fitting seamlessly into your busy schedule.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>We aim to build a future where everyone has seamless access to quality healthcare, supported by cutting-edge technology and a user-centric approach. At Docify, we are dedicated to creating a healthier world, one appointment at a time.</p>
      </div>
    </div>

    <div className='text-xl my-4'>
      <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
    </div>

    <div className='flex flex-col md:flex-row mb-20'>
      <div className='border px-10 md:px-16 py-8  sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>24/7 Support:</b>
        <p>Access round-the-clock customer service to assist with any issues or questions, anytime.</p>
      </div >
      <div className='border px-10 md:px-16 py-8  sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Top-Rated Professionals:</b>
        <p>Connect with verified, highly-rated doctors across various specialties for reliable and trusted care.</p>
      </div>
      <div className='border px-10 md:px-16 py-8  sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>Efficiency:</b>
        <p>Quickly schedule appointments with our straightforward and user-friendly platform.</p>
      </div>
    </div>

    </div>
  )
}

export default About