'use client'
import React, {useEffect, useRef, useState} from 'react'
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label";
import Image from 'next/image';
import {useRouter, usePathname} from 'next/navigation'
import {BackgroundBeams} from "@/components/ui/background-beams";
import FullPageLoader from "@/components/ui/FullPageLoader";

export default function Double({children}) {
    const [heading, setHeading] = useState("")
    const [description, setDescription] = useState("")
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [isChecked, setIsChecked] = useState(pathname.includes("employer"));
    const [switcherText, setSwitcherText] = useState(pathname.includes("employer") ? "Switch to Candidate" : "Switch to Employer");
    const child = <div
        className={`w-auto md:w-[50vw] ${pathname !== '/candidate/otp' && pathname !== '/employer/otp' ? 'mt-12' : 'mt-0'}  md:mt-0 md:mb-16 h-auto flex justify-center items-center`}>{children}</div>
    const copyRight = <div
        className={`flex py-8 md:pb-5 justify-center z-20 content-end  ${pathname !== '/candidate/otp' && pathname !== '/employer/otp' ? 'md:w-[50vw]' : 'w-auto'} items-center h-auto md:h-[10vh] font-bold text-slate-50`}>
        &#169;2024 CareerSync
    </div>
    useEffect(() => {
        if (pathname.includes("employer")) {
            setHeading("CareerSync: Bridging Talent and Opportunity for Success.");
            setDescription("Discover exceptional talent effortlessly with CareerSync. Empower your team by recruiting top candidates and shaping a workforce that drives success.");
        } else {
            setHeading("CareerSync: Ignite Your Future, Embrace Opportunities.");
            setDescription("Welcome to CareerSync, your passport to career advancement. Seamlessly connect with opportunities and take the next step towards a brighter, fulfilling future.");
        }
    }, [pathname])
    const handleSwitcher = async (checked) => {
        checked ? await router.push('/employer/signin') : await router.push('/candidate/signin')
        setIsChecked(checked);
        setSwitcherText(checked ? "Switch to Candidate" : "Switch to Employer");
    }

    return (
            <div
                className={`${pathname !== '/candidate/otp' && pathname !== '/employer/otp' ? 'h-full' : 'h-screen'} w-auto bg-slate-950 relative flex flex-col justify-between antialiased`}>
                <div
                    className={`flex flex-col sm:flex-row ${pathname !== '/candidate/otp' && pathname !== '/employer/otp' ? 'md:w-[50vw]' : 'w-auto'}  gap-3 sm:gap-0 sm:justify-between items-center z-20 h-auto md:h-[20vh] sm:px-8 md:pl-8 mt-10 md:mt-0`}>
                    <Image src={'/Logo-White.svg'} alt={'CareerSync'} width={70} height={70}/>
                    <div className="flex items-center space-x-2">
                        <Switch className='dark' defaultChecked={isChecked}
                                onCheckedChange={handleSwitcher}
                                id="airplane-mode"/>
                        <Label htmlFor="airplane-mode"
                               className='font-bold text-slate-50'>{switcherText}</Label>
                    </div>
                </div>
                <div className='flex justify-center z-20 items-center h-auto sm:h-[90vh] md:h-[70vh]'>
                    {pathname !== '/candidate/otp' && pathname !== '/employer/otp' && <div className="md:flex hidden flex-col justify-center items-center w-[50vw] p-5">
                        <h1 className="relative z-10 text-lg md:text-3xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
                            {heading}
                        </h1>
                        <p></p>
                        <p className="text-slate-400 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
                            {description}
                        </p>
                    </div>}
                    {child}
                </div>
                {copyRight}
                <BackgroundBeams className='h-screen'/>
            </div>
    )
}
