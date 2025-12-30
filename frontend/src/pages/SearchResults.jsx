import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, NavLink } from 'react-router-dom';
import { FaCommentAlt } from 'react-icons/fa';
import Fuse from 'fuse.js';

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('query'));
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Whenever location.search changes, update the searchQuery
    setSearchQuery(new URLSearchParams(location.search).get('query'));
  }, [location.search]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!searchQuery) {
        setError('Please enter a valid search query.');
        setDoctors([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('You must be logged in to search.');
          setDoctors([]);
          return;
        }

        const response = await axios.get(`/api/doctor/search?q=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;

          if (data.length > 0) {
            setDoctors(data);
            setError('');
          } else {
            setDoctors([]);
            setError('No doctors found');
          }
        } else {
          setError('Error fetching doctors');
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching doctors', error);
        setError('Something went wrong while fetching the doctors.');
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, [searchQuery]);

  return (
    <div>
      <h2 className='text-gray-600 text-lg mb-0 mt-0'>Search Results :</h2>

      {error && (
        <p style={{ color: 'lightcoral' }}>
          {error}
        </p>
      )}

      {doctors.length > 0 && (
        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
          {doctors.map((doctor) => (
            <div
              onClick={() => {
                window.location.href = `/appointment/${doctor._id}`;
                scrollTo(0, 0);
              }}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={doctor._id}
            >
              <img className='bg-blue-50 w-full h-48 object-cover' src={doctor.image} alt={doctor.name} />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${doctor.available ? 'text-green-500' : 'text-gray-500'} `}>
                  <p className={`w-2 h-2 ${doctor.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                  <p>{doctor.available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                <p className='text-gray-600 text-sm'>{doctor.speciality}</p>
                <p className='text-gray-500 text-xs'>{doctor.address?.line1}{doctor.address?.line2 ? `, ${doctor.address.line2}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}


      {error === 'No doctors found' && (
        <div>
          <NavLink to='/doctalk'>
            <button className="px-6 py-2 mt-4 bg-primary text-white rounded-md flex items-center justify-center">
              <FaCommentAlt className="mr-2" /> Chat with DOCTALK
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default SearchResults;


