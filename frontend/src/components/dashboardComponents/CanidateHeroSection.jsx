'use client'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaLocationDot} from "react-icons/fa6";
import {searchJobs} from "@/lib/JobSearch";
import {ImSpinner2} from "react-icons/im";
import {usePathname, useRouter} from "next/navigation";
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {WavyBackground} from "@/components/ui/wavy-background";

const socket = io('http://localhost:3001');

const CandidateHeroSection = () => {
    const [search, setSearch] = useState('')
    const [location, setLocation] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const path = usePathname();
    const router = useRouter();

    useEffect(() => {
        socket.on('notify', (msg) => {
            toast.info(msg); // Display toast notification
        });

        return () => {
            socket.off('notify');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(search, location)
        if (search === '' && location === '') return
        setIsLoading(true)
        if (path.includes('candidate/dashboard')) {
            await router.push(`/candidate/dashboard/search-jobs?search=${search}&location=${location}`)
            setIsLoading(false)
        } else {

            await router.push(`/employer/dashboard/search-candidates?search=${search}&location=${location}`)
            setIsLoading(false)
        }
    }
    return (
        <div className='pb-12 pt-14 px-10 md:px-12 relative'>
            <WavyBackground backgroundFill={'#020617'} className="max-w-4xl mx-auto pb-35">
                {path.includes('candidate/dashboard') ?
                    <>
                        <h1 className={`md:text-5xl leading-7 ${path.includes('search-jobs') ? 'hidden' : ''} text-3xl text-center text-slate-50 font-bold mb-7`}>Get
                            The <span
                                className='text-[#504ED7]'>Right Job</span> <br className='hidden md:block'/> You
                            Deserve!
                        </h1>
                        <p className={`${path.includes('search-jobs') ? 'hidden' : ''} text-slate-50 text-sm text-center`}>1,850,750
                            jobs listed here! Your dream job is
                            waiting</p>
                    </> :
                    <>
                        <h1 className={`md:text-5xl leading-7 ${path.includes('search-jobs') ? 'hidden' : ''} text-3xl text-center text-slate-50 font-bold mb-7`}>Find
                            Your <span
                                className='text-[#504ED7]'>Perfect Candidate</span> <br
                                className='hidden md:block'/> Today!</h1>
                        <p className={`text-slate-50 text-sm text-center ${path.includes('search-jobs') ? 'hidden' : ''}`}>1,850,750
                            Profiles Available! Your ideal hire
                            is just a click away</p>
                    </>
                }
                <div
                    className='w-full max-w-[800px] m-auto bg-white shadow-xl border border-gray-200 md:rounded-full rounded-md md:h-16 h-auto md:py-0 py-6 px-4 mt-12'>
                    <form
                        className='flex md:flex-row flex-col justify-between items-center h-full gap-3'>
                        <div
                            className='flex w-full items-center gap-3 md:mb-0 mb-5 md:border-none border-b border-gray-200 md:pb-0 pb-3 flex-1'>
                            <AiOutlineSearch className='text-xl text-slate-500'/>
                            <input type='text' value={search} onChange={e => setSearch(e.target.value)}
                                   placeholder='Job title or keyword'
                                   className='outline-0 h-full px-2 w-full text-slate-950 font-medium placeholder:text-slate-400 text-sm'/>
                        </div>
                        <div
                            className='flex w-full items-center gap-3 md:mb-0 mb-5 md:border-none border-b border-slate-700 md:pb-0 pb-3 flex-1'>
                            <FaLocationDot className='text-xl text-slate-500'/>
                            <input type='text' value={location} onChange={e => setLocation(e.target.value)}
                                   placeholder='Lahore'
                                   className='outline-0 h-full px-2 w-full placeholder:text-slate-500 font-medium text-sm'/>
                        </div>
                        <button
                            className="bg-slate-950 text-sm flex-0.5 w-full md:basis-1/6 px-6 py-2 outline-0 flex justify-center items-center gap-1 dark:bg-zinc-800 text-slate-50 rounded-full h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 active:text-slate-50 hover:bg-slate-50 hover:border-slate-950 hover:border-2 hover:text-slate-950"
                            onClick={handleSubmit} disabled={isLoading}
                        >
                            {isLoading ? <div className='flex gap-1 w-full justify-center items-center'>
                                <ImSpinner2 className="mr-2 w-5 h-5 animate-spin"/>
                            </div> : <div className='flex gap-1 w-full justify-center items-center'>
                                Search
                            </div>}
                        </button>

                    </form>
                </div>
            </WavyBackground>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default CandidateHeroSection