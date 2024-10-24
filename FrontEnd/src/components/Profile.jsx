import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import Footer from './shared/Footer'; 

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    
    const latestResume = user?.profile?.resumeHistory?.length > 0 ? user.profile.resumeHistory[user.profile.resumeHistory.length - 1] : null;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            

            <div className='flex max-w-6xl mx-auto my-20 space-x-6'>
                
                
                <div className='w-1/3 bg-white border border-gray-200 rounded-2xl p-8'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="/shardar.png" alt="profile" />
                            </Avatar>
                            <div>
                                <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                                <p>{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                    </div>
                    <div className='my-5'>
                        <div className='flex items-center gap-3 my-2'>
                            <Mail />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2'>
                            <Contact />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                    <div className='my-5'>
                        <h1>Skills</h1>
                        <div className='flex items-center gap-1'>
                            {
                                user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                            }
                        </div>
                    </div>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-md font-bold">Latest Resume</Label>
                        {
                            latestResume ? (
                                <a target='_blank' href={latestResume.url} className='text-blue-500 w-full hover:underline cursor-pointer'>
                                    {latestResume.originalName}
                                </a>
                            ) : (
                                <span>NA</span>
                            )
                        }
                    </div>
                </div>

                {/* */}
                <div className='flex-grow bg-white rounded-2xl p-8'>
                    <h1 className='font-bold text-lg mb-5'>Applied Jobs</h1>
                    <AppliedJobTable />
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />

            {/* */}
            <Footer />
        </div>
    )
}

export default Profile;
