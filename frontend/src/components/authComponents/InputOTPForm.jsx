"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"


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
import React from "react";
import Link from "next/link";
import {MdArrowBack, MdSecurity, MdOutlineSecurityUpdateGood} from "react-icons/md";
import {FaArrowRightLong} from "react-icons/fa6";
import Image from "next/image";


const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

import {useEffect, useState} from 'react';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TiWarning} from "react-icons/ti";
import {AppContext, useAppContext} from "@/Context/Candidate_Employer_Data";
import DynamicAlert from "@/components/ui/DynamicAlert";
import {useRouter} from "next/navigation";
import {ImSpinner2} from "react-icons/im";
import {PiSignInBold} from "react-icons/pi";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import {HOST} from "@/lib/utils";

export default function InputOTPForm({otpFor}) {
    const {candidate, employer} = useAppContext();
    const router = useRouter();
    const [verified, setVerified] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [showError, setShowError] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const [timerInterval, setTimerInterval] = useState(null);
    const [title, setTitle] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(null);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    });

    useEffect(() => {
        // Start the countdown timer when the component mounts
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown === 0) {
                    setOtpExpired(true);
                }
                return prevCountdown - 1;
            });
        }, 1000);
        setTimerInterval(intervalId);
        return () => clearInterval(intervalId);
    }, []);

    function onSubmit(data) {
        setIsLoading("verifyOTP");
        if (otpFor === 'Candidate') {
            fetch(`${HOST}/candidate/verifyOTP`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId: candidate.id, otp: data.pin}),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setShowAlert(true);
                        setTitle("Error")
                        setAlertMessage(data.error);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 4000);
                        setIsLoading(null);
                    } else {
                        setVerified(true);
                        setIsLoading(null);
                    }
                })
                .catch((error) => {
                    setShowAlert(true);
                    setTitle("Error")
                    setAlertMessage(error.error);
                    setIsLoading(null);

                });
        } else {
            fetch(`${HOST}/employer/verifyOTP`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId: employer.id, otp: data.pin}),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setShowAlert(true);
                        setTitle("Error")
                        setAlertMessage(data.error);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 4000);
                        setIsLoading(null);
                    } else {
                        setVerified(true);
                        setIsLoading(null);
                    }
                })
                .catch((error) => {
                    setShowAlert(true);
                    setTitle("Error")
                    setAlertMessage(error.error);
                    setIsLoading(null);
                });
        }
    }

    function reSendHandler() {
        setShowError(false)
        setIsLoading("resendOTP")
        if (otpFor === 'Candidate') {
            fetch(`${HOST}/candidate/resendOTPVerificationCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId: candidate.id, email: candidate.email}),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setShowAlert(true);
                        setTitle("Error")
                        setAlertMessage(data.error);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 4000);
                        setIsLoading(null);
                        return null;
                    } else {
                        setShowAlert(true);
                        setTitle("Success")
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 4000);
                        setAlertMessage(data.message);
                        setOtpExpired(false);
                        setCountdown(60);
                        setIsLoading(null);
                    }
                })
                .catch((error) => console.log(error));
        } else {
            fetch(`${HOST}/employer/resendOTPVerificationCode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userId: employer.id, email: employer.email}),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setShowAlert(true);
                        setTitle("Error")
                        setAlertMessage(data.error);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 4000);
                        setIsLoading(null);
                        return null;
                    } else {
                        setShowAlert(true);
                        setTitle("Success")
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 4000);
                        setAlertMessage(data.message);
                        setOtpExpired(false);
                        setCountdown(60);
                        setIsLoading(null);
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    return (
        <>
            {showAlert && (
                <DynamicAlert title={title} alertMessage={alertMessage}/>
            )}
            <div
                className="max-w-md w-full h-auto flex flex-col justify-center items-center gap-2 mx-auto rounded-none md:rounded-2xl p-4">
                {verified ? (
                    <>
                        <Image src='/verified.gif' alt={'Verified'} width={120} height={120}/>
                        <button
                            className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                            onClick={async () => {
                                setIsLoading("nextSection")
                                await router.push(otpFor === 'Candidate' ? '/candidate/resume' : '/employer/profile')
                                setIsLoading(null)
                            }}
                            disabled={isLoading === "nextSection"}
                        >
                            {isLoading === "nextSection" ? (
                                <>
                                    <span>Please Wait</span>
                                    <ImSpinner2 size={20} className="animate-spin"/>
                                </>
                            ) : (
                                <>
                                    <span>{otpFor === 'Candidate' ? 'Resume Upload Section' : 'Profile Setup Section'}</span>
                                    <FaArrowRightLong size={20}/>
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        <span className='text-slate-50'><MdSecurity size={40}/></span>
                        <h2 className="font-bold w-full text-xl text-center text-slate-50">
                            Confirm log in with OTP.
                        </h2>
                        <p className='text-sm w-full text-slate-200 italic text-center'>
                            We have sent a one-time password (OTP) to your verified email address. Please enter it
                            below.
                        </p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                  className="w-2/3 gap-5 flex flex-col justify-center items-center text-slate-50">
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={6}
                                                    className={'dark'}
                                                    render={({slots}) => (
                                                        <InputOTPGroup>
                                                            {slots.map((slot, index) => (
                                                                <InputOTPSlot
                                                                    className='border-slate-400 rounded-md border'
                                                                    key={index} {...slot} />
                                                            ))}
                                                        </InputOTPGroup>
                                                    )}
                                                    {...field}
                                                />
                                            </FormControl>
                                            {showError && <FormMessage/>}
                                        </FormItem>
                                    )}
                                />
                                {!otpExpired && <div>Time remaining: {countdown} seconds</div>}
                                {otpExpired ?
                                    <button
                                        className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                                        onClick={reSendHandler}
                                        disabled={isLoading === "resendOTP"}
                                    >
                                        {isLoading === "resendOTP" ? (
                                            <>
                                                <span>Please Wait</span>
                                                <ImSpinner2 size={20} className="animate-spin"/>
                                            </>
                                        ) : (
                                            <>
                                                <span>Resend OTP</span>
                                                <MdOutlineSecurityUpdateGood size={20}/>
                                            </>
                                        )}
                                    </button> :
                                    <button
                                        className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                                        type="submit"
                                        disabled={isLoading === "verifyOTP"}
                                    >
                                        {isLoading === "verifyOTP" ? (
                                            <>
                                                <span>Please Wait</span>
                                                <ImSpinner2 size={20} className="animate-spin"/>
                                            </>
                                        ) : (
                                            <>
                                                <span>Verify OTP</span>
                                                <MdOutlineSecurityUpdateGood size={20}/>
                                            </>
                                        )}
                                    </button>}
                    </form>
                    </Form>
                    </>
                    )}
                <div className="flex flex-col sm:flex-row justify-end items-center mt-6 text-sm">
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
        ;
}
