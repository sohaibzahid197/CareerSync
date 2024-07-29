"use client";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn, HOST} from "@/lib/utils";
import {MdOutlineAlternateEmail, MdLock} from "react-icons/md";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {PiSignInBold} from "react-icons/pi";
import {FcGoogle} from "react-icons/fc";
import {BsGithub} from "react-icons/bs";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TiWarning} from "react-icons/ti";
import {signIn, useSession} from "next-auth/react";
import {AppContext, useAppContext} from "@/Context/Candidate_Employer_Data";
import {ImSpinner2} from "react-icons/im";
import DynamicAlert from "@/components/ui/DynamicAlert";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


export default function CandidateSignIn() {
    const {setCandidate} = useAppContext();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(null);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()
    const onSubmit = (data) => {
        setIsLoading("signin");
        fetch(`${HOST}/candidate/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then( async (data) => {
                if (data.error) {
                    setShowAlert(true);
                    setTitle("Error");
                    setAlertMessage(data.error);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    setIsLoading(null);
                } else {
                    setCandidate({id:data.id, email:data.email});
                    setShowAlert(true);
                    setTitle("Success");
                    setAlertMessage(data.message);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    await router.push("/candidate/resume");
                    setIsLoading(null);
                }
            })
            .catch((error) => console.log(error));
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            {showAlert && (
                <DynamicAlert title={title} alertMessage={alertMessage} />
            )}
            <div
                className="max-w-md w-full flex flex-col justify-center items-center mx-auto rounded-none md:rounded-2xl p-4">
                <h2 className="font-bold w-full text-xl text-slate-50">
                    Welcome to CareerSync
                </h2>
                <p className='text-sm w-full text-slate-200 italic'>
                    &quot;Today unlock your dream opportunities and discover tailored career paths.&quot;
                </p>
                <div className="mt-12 w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email" className='text-slate-50'>Email Address</Label>
                            <Input id="email" Icon={<MdOutlineAlternateEmail size={20}/>}
                                   placeholder="example@gmail.com"
                                   type="email" className='text-slate-50 bg-slate-900 placeholder:text-slate-400'
                                   {...register("email")}/>
                        </LabelInputContainer>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password" className='text-slate-50'>Password</Label>
                            <Input Icon={<MdLock size={20}/>} finalIcon={
                                showPassword
                                    ? <IoMdEyeOff size={20} onClick={toggleShowPassword} className='cursor-pointer'/>
                                    : <IoMdEye size={20} onClick={toggleShowPassword} className='cursor-pointer'/>
                            } id="password" placeholder="••••••••" type={showPassword ? "text" : "password"}
                                   className='text-slate-50 bg-slate-900 placeholder:text-slate-400'
                                   {...register("password")}/>
                        </LabelInputContainer>
                        <div className="flex justify-end items-center mb-4">
                            <Link href="/candidate/forgot-password" className="text-slate-300 text-sm hover:underline">Forgot Password?</Link>
                        </div>
                        <button
                            className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                            type="submit"
                            disabled={isLoading === "signin"}
                        >
                            {isLoading === "signin" ? (
                                <>
                                    <span>Please Wait</span>
                                    <ImSpinner2 size={20} className="animate-spin"/>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <PiSignInBold size={20}/>
                                </>
                            )}
                        </button>
                    </form>
                    <div
                        className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full"/>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                        <button
                            className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                            onClick={async () => {
                                setIsLoading("github")
                                await signIn('github', {callbackUrl: `${HOST}/dashboard`})
                                setIsLoading(null)
                            }}
                            disabled={isLoading === "github"}
                        >
                            {isLoading === "github" ? (
                                <>
                                    <span>Please Wait</span>
                                    <ImSpinner2 size={20} className="animate-spin"/>
                                </>
                            ) : (
                                <>
                                    <BsGithub size={20}/>
                                    <span>Github</span>
                                </>
                            )}
                        </button>
                        <span className="text-slate-400">or</span>
                        <button
                            className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                            onClick={async () => {
                                setIsLoading("google")
                                await signIn('google', {callbackUrl: `${HOST}/dashboard`})
                                setIsLoading(null)
                            }}
                            disabled={isLoading === "google"}
                        >
                            {isLoading === "google" ? (
                                <>
                                    <span>Please Wait</span>s
                                    <ImSpinner2 size={20} className="animate-spin"/>
                                </>
                            ) : (
                                <>
                                    <FcGoogle size={20}/>
                                    <span>Google</span>

                                </>
                            )}
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center mt-6 text-sm">
                        <span className="text-slate-400">Don&apos;t have an account? </span>
                        <Link href="/candidate/signup"
                              className="text-slate-300 dark:text-zinc-900 font-medium hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
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
