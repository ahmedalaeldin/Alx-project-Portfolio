import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        options: [
            { value: "Cairo", label: "Cairo" },
            { value: "Giza", label: "Giza" },
            { value: "Alexandria", label: "Alexandria" },
            { value: "Suhag", label: "Suhag" },
            { value: "Luxor", label: "Luxor" },
            { value: "Port Said", label: "Port Said" },
            { value: "Dakahlia", label: "Dakahlia" },
            { value: "Aswan", label: "Aswan" },
            { value: "Fayoum", label: "Fayoum" },
            { value: "Kafr El Sheikh", label: "Kafr El Sheikh" },
            { value: "Ismailia", label: "Ismailia" },
            { value: "Beni Suef", label: "Beni Suef" },
            { value: "Minya", label: "Minya" },
            { value: "Qalyubia", label: "Qalyubia" },
            { value: "South Sinai", label: "South Sinai" },
            { value: "North Sinai", label: "North Sinai" },
            { value: "Matrouh", label: "Matrouh" },
            { value: "Red Sea", label: "Red Sea" },
            { value: "Damietta", label: "Damietta" }
        ]
    },
    {
        filterType: "Industry",
        options: [
            { value: "culinary", label: "Culinary" },
            { value: "plumber", label: "Plumber" },
            { value: "electrical", label: "Electrical" },
            { value: "mechanical", label: "Mechanical" },
            { value: "information technology", label: "Information Technology" },
            { value: "construction", label: "Construction" },
            { value: "healthcare", label: "Healthcare" },
            { value: "hospitality", label: "Hospitality" },
            { value: "automotive", label: "Automotive" },
            { value: "textiles", label: "Textiles" },
            { value: "beauty and wellness", label: "Beauty and Wellness" },
            { value: "media and communication", label: "Media and Communication" },
            { value: "agriculture", label: "Agriculture" },
            { value: "transportation", label: "Transportation" },
            { value: "real estate", label: "Real Estate" },
            { value: "finance", label: "Finance" }
        ]
    },
];

const FilterCard = () => {
    const [selectedValues, setSelectedValues] = useState({
        Location: [],
        Industry: [],
    });
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();

    const handleSelectionChange = (filterType, selectedOptions) => {
        setSelectedValues(prev => ({
            ...prev,
            [filterType]: selectedOptions.map(option => option.value) // Get selected values
        }));
    };

    const handleSearch = () => {
        dispatch(setSearchedQuery({ searchQuery, selectedValues }));
    };

    useEffect(() => {
        dispatch(setSearchedQuery({ searchQuery, selectedValues }));
    }, [searchQuery, selectedValues]);

    return (
        <div className='w-full bg-white p-4 rounded-md shadow-md'>
            <div className='flex justify-center mb-4'>
                <input
                    type="text"
                    placeholder="Search for jobs, companies, or keywords"
                    className="w-1/2 p-2 border border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Search
                </button>
            </div>
            <h1 className='font-bold text-lg mb-2'>Filter Jobs</h1>
            <hr className='mb-3' />
            <div className='grid grid-cols-1 gap-4'>
                {
                    filterData.map((data, index) => (
                        <div key={index} className='border p-3 rounded-md'>
                            <h2 className='font-bold'>{data.filterType}</h2>
                            <Select
                                isMulti
                                options={data.options}
                                onChange={(selectedOptions) => handleSelectionChange(data.filterType, selectedOptions)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder={`Select ${data.filterType}...`}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FilterCard;
