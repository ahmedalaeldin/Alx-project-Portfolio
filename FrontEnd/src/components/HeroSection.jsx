import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        if (query.trim()) {
            dispatch(setSearchedQuery(query));
            navigate('/browse');
        }
    };

    return (
        <div 
            className='text-center bg-cover bg-center h-screen flex items-center justify-center'
            style={{
                backgroundImage: 'url(/assets/background.jpg)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className='flex flex-col gap-5 text-white bg-opacity-50 bg-black p-10 rounded-lg'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#3A8DDE] font-medium'>
                    Your Gateway to Top Vocational Jobs
                </span>
                <h1 className='text-5xl font-bold'>
                    Find the Best <br />
                    <span className='text-[#635DFF]'>Vocational Jobs in Egypt</span>
                </h1>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#3A8DDE]'>
                    Qualification Development Bank - Your way to get your dream job
                </span>

                {/* Search Bar */}
                <div className='flex w-full max-w-xl mx-auto shadow-lg border border-gray-200 rounded-full items-center gap-4 transition-all duration-300'>
                    <input
                        type='text'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full px-3 py-2 text-lg rounded-full transition-all duration-300 placeholder-shown:border-transparent placeholder:text-transparent focus:placeholder:text-gray-400 text-black' // Set text color to black
                        aria-label='Search for jobs'
                        placeholder="Search for jobs, companies, or keywords"
                    />
                    <Button 
                        onClick={searchJobHandler} 
                        className='rounded-full bg-[#635DFF] px-6 py-2 transition-all duration-300 hover:bg-[#4e4be2]'
                        aria-label='Search'
                    >
                        <Search className='h-6 w-6 text-white' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
