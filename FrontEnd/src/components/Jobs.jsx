import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import Footer from './shared/Footer'; 
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/background.jpg'; 

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isSearchPerformed, setIsSearchPerformed] = useState(false); 

    useEffect(() => {
        if (typeof searchedQuery === 'string' && searchedQuery) { 
            setIsSearchPerformed(true); 
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase());
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
            setIsSearchPerformed(false);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div 
            className="flex flex-col min-h-screen" 
            style={{
                backgroundImage: `url(${backgroundImage})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Navbar />
            <div className='flex flex-row mt-20 w-full'> 
                {/* */}
                <div className='w-1/4 p-4'>
                    <FilterCard />
                </div>
                
                {/* */}
                <div className='flex-1 flex flex-col items-center p-4'> 
                    <div className='h-[88vh] overflow-y-auto pb-1 w-full'> 
                        {
                            isSearchPerformed && filterJobs.length <= 0 ? ( 
                                <span>Job not found</span>
                            ) : (
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer /> {/* Footer component added here */}
        </div>
    );
};

export default Jobs;
