"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Input} from "@/components/ui/input"
import {SiMaildotru} from "react-icons/si";


import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {toast} from "@/components/ui/use-toast"
import React, {useEffect, useLayoutEffect, useState} from "react";
import Link from "next/link";
import {
    MdArrowBack,
    MdSecurity,
    MdOutlineSecurityUpdateGood,
    MdVpnKey,
    MdOutlineLockReset,
    MdOutlineAlternateEmail, MdLock
} from "react-icons/md";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {PiSignInBold} from "react-icons/pi";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TiWarning} from "react-icons/ti";
import {cn, HOST} from "@/lib/utils";
import {usePathname, useSearchParams, useParams} from "next/navigation";
import {AppContext, useAppContext} from "@/Context/Candidate_Employer_Data";
import DynamicAlert from "@/components/ui/DynamicAlert";
import {ImSpinner2} from "react-icons/im";


export default function ForgotPassword({resetFor}) {

    const {candidate, setCandidate, employer, setEmployer} = useAppContext();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [email, setEmail] = useState("••••••••••••••••");
    const path = usePathname()
    const params = useParams();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const uuid = useSearchParams().get('uuid');
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()
    function maskEmail(email) {
        const [username, domain] = email.split("@");
        const maskedUsername = username.charAt(0) + username.slice(1, -2).replace(/./g, "•") + username.slice(-2);
        return  maskedUsername + "@" + domain;
    }
    function gettingEmail(userId) {
        if (path.includes('/candidate/reset-password') || path.includes('/employer/reset-password')) {
            const candidateGetEndPoint = `${HOST}/candidate/${userId}`;
            const employerGetEndPoint = `${HOST}/employer/${userId}`;
            fetch(resetFor === 'Candidate' ? candidateGetEndPoint : employerGetEndPoint)
                .then((res) => res.json())
                .then(async (data) => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        setEmail(maskEmail(data.email))
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    useEffect(() => {
        gettingEmail(userId)
        if (path.includes('/candidate/reset-password') || path.includes('/employer/reset-password')) {
            resetFor === 'Candidate' ? setCandidate({id: userId, email}) : setEmployer({id: userId, email})
        }
    }, [userId])
    const onSubmit = (data) => {
        setIsLoading(true);
        const candidateForgotEndPoint = `${HOST}/candidate/requestPasswordReset`;
        const employerForgotEndPoint = `${HOST}/employer/requestPasswordReset`;
        const candidateResetEndPoint = `${HOST}/candidate/resetPassword`;
        const employerResetEndPoint = `${HOST}/employer/resetPassword`;
        const candidateRedirectURL = `${HOST}/candidate/reset-password`
        const employerRedirectURL = `${HOST}/employer/reset-password`
        path.includes('/candidate/reset-password') || path.includes('/employer/reset-password') ? fetch(resetFor === 'Candidate' ? candidateResetEndPoint : employerResetEndPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                resetString: uuid,
                newPassword: data.password,
            }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.error) {
                    setShowAlert(true);
                    setAlertMessage(data.error);
                    setTitle("Error");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    setIsLoading(false);
                } else {
                    setShowAlert(true);
                    setAlertMessage(data.message);
                    setTitle("Success");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    setIsLoading(false);
                    setPasswordChanged(true);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                setShowAlert(true);
                setAlertMessage(error.message);
                setTitle("Error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
                setIsLoading(false);
            }) : fetch(resetFor === 'Candidate' ? candidateForgotEndPoint : employerForgotEndPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                redirectUrl: resetFor === 'Candidate' ? candidateRedirectURL : employerRedirectURL
            }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.error) {
                    setShowAlert(true);
                    setAlertMessage(data.error);
                    setTitle("Error");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    setIsLoading(false);
                } else {
                    resetFor === 'Candidate' ? setCandidate({
                        id: data.id,
                        email: data.email
                    }) : setEmployer({id: data.id, email: data.email});
                    setShowAlert(true);
                    setAlertMessage(data.message);
                    setTitle("Success");
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                setShowAlert(true);
                setAlertMessage(error.message);
                setTitle("Error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 4000);
                setIsLoading(false);
            })
    }
    return (
        <>
            {showAlert && (
                <DynamicAlert title={title} alertMessage={alertMessage}/>
            )}
            <div
                className="max-w-md w-full h-[60vh] flex flex-col justify-center items-center gap-2 mx-auto rounded-none md:rounded-2xl p-4">
                <span
                    className='text-slate-50'>{path.includes('/candidate/reset-password') || path.includes('/employer/reset-password') ?
                    <MdVpnKey size={60}/> : <SiMaildotru size={60}/>}</span>
                <h2 className="font-bold w-full text-xl text-center text-slate-50">
                    {path.includes('/candidate/reset-password') || path.includes('/employer/reset-password') ? 'Reset Password' : 'Forgot Password?'}
                </h2>
                <p className='text-sm w-full text-slate-200 italic text-center'>
                    {path.includes('/candidate/reset-password') || path.includes('/employer/reset-password') ? (passwordChanged ? `Password has been Reset for ${email}` : `Enter New Password for ${email}`) : "No worries! We&apos;ll send you reset instructions."}
                </p>
                <div className="mt-5 w-full">
                    <form className='flex flex-col justify-center items-center' onSubmit={handleSubmit(onSubmit)}>
                        {passwordChanged ? <Image src='/verified.gif' alt={'Verified'} width={140} height={140}/>
                            : <><LabelInputContainer className="mb-4">
                                <Label htmlFor="email" className='text-slate-50'>
                                    {path.includes('/candidate/reset-password') || path.includes('/employer/reset-password') ? 'Enter New Password' : 'Email Address'}
                                </Label>
                                {
                                    path.includes('/candidate/reset-password') || path.includes('/employer/reset-password') ?
                                        <Input Icon={<MdLock size={20}/>}
                                               placeholder="••••••••"
                                               type="password"
                                               className='text-slate-50 bg-slate-900 placeholder:text-slate-400'
                                               {...register("password")}/>
                                        :
                                        <Input id="email" Icon={<MdOutlineAlternateEmail size={20}/>}
                                               placeholder='example@gmail.com'
                                               type="email"
                                               className='text-slate-50 bg-slate-900 placeholder:text-slate-400'
                                               {...register("email")}/>
                                }
                            </LabelInputContainer>
                                <button
                                    className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                                    type="submit" disabled={isLoading}
                                >
                                    {isLoading ? <div className='flex gap-1 justify-center items-center'>
                                        <ImSpinner2 className="mr-2 w-5 h-5 animate-spin"/>
                                        Please wait
                                    </div> : <div className='flex gap-1 justify-center items-center'>
                                        Reset Password
                                        <MdOutlineLockReset size={20}/>
                                    </div>}
                                </button>
                            </>}
                    </form>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center mt-6 text-sm">
                    <span className="text-slate-400 flex justify-center items-center"><MdArrowBack
                        size={20}/>Return to &nbsp;</span>
                    <Link href="/candidate/signin"
                          className="text-slate-300 dark:text-zinc-900 font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </>
    )
}
const LabelInputContainer = ({
                                 children,
                                 className,
                             }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};