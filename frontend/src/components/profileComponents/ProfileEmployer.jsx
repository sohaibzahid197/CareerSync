"use client";
import React, {useState} from 'react';

import {MdInsertLink, MdOutlineAlternateEmail} from 'react-icons/md';
import {ImFacebook2, ImSpinner2} from "react-icons/im";
import {FaXTwitter} from "react-icons/fa6";
import {FaInstagramSquare} from "react-icons/fa";
import {cn, HOST} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CgProfile} from "react-icons/cg";
import {Textarea} from "@/components/ui/textarea";
import {PiSignInBold} from "react-icons/pi";
import {ReloadIcon} from "@radix-ui/react-icons";
import DynamicAlert from "@/components/ui/DynamicAlert";
import {useRouter} from "next/navigation";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

function EmployerDetailsForm() {
    const [formData, setFormData] = useState({
        profilePicture: null,
        companyName: '',
        industry: '',
        address: '',
        contact: '',
        profession: '',
        companyDescription: '',
        websiteURL: '',
        facebookURL: '',
        instagramURL: '',
        twitterURL: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [title, setTitle] = useState("");
    const router = useRouter();


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({
                    ...prevState,
                    profilePicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    async function storeCompleteData(formData) {
        await fetch(`${HOST}/employer-profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        }).then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setShowAlert(true);
                    setTitle("Error");
                    setAlertMessage(data.error);
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 7000);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                } else {
                    setShowAlert(true);
                    setTitle("Success");
                    setAlertMessage(data.message);
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 4000);
                    setFormData({
                        companyName: '',
                        industry: '',
                        address: '',
                        contact: '',
                        profession: '',
                        companyDescription: '',
                        websiteURL: '',
                        facebookURL: '',
                        instagramURL: '',
                        twitterURL: '',
                        profilePicture: null
                    });
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            })
            .catch((error) => {
                setShowAlert(true);
                setTitle("Error");
                setAlertMessage(error.message);
                setIsLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                }, 7000);
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if  (!formData.profilePicture || !formData.companyName || !formData.industry || !formData.address || !formData.contact || !formData.profession || !formData.companyDescription || !formData.websiteURL || !formData.facebookURL || !formData.instagramURL || !formData.twitterURL) {
            setShowAlert(true)
            setAlertMessage("All fields are required!")
            setTitle("Warning")
            setIsLoading(false)
            setTimeout(() => {
                setShowAlert(false);
                return null;
            }, 4000);
            window.scrollTo({top: 0, behavior: 'smooth'});
            return null;
        }
        try {
            let imageData = new FormData();
            imageData.append("file", formData.profilePicture);
            imageData.append("upload_preset", "careersync");
            imageData.append("cloud_name", "dy5yzo1ji");
            await fetch("https://api.cloudinary.com/v1_1/dy5yzo1ji/upload", {
                method: "POST",
                body: imageData
            })
                .then((response) => response.json())
                .then(async (data) => {
                    formData.profilePicture = data.secure_url;
                    await storeCompleteData(formData);
                    await router.push("/employer/dashboard");
                })
                .catch((error) => {
                    setShowAlert(true);
                    setTitle("Error");
                    setAlertMessage(error.message);
                    setIsLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 7000);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
        } catch (error) {
            setShowAlert(true);
            setTitle("Error");
            setAlertMessage(error.message);
            setIsLoading(false);
            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    return (
        <>
            {
                showAlert && <DynamicAlert title={title} alertMessage={alertMessage}/>
            }
            <form className="bg-transparent shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full " onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-slate-50 text-center mb-6">Employer/Company Details</h2>
                <div className="space-y-4">
                    <div className="flex flex-col justify-center items-center gap-5">
                        <Avatar className='h-32 w-32'>
                            <AvatarImage src={formData.profilePicture}/>
                            <AvatarFallback><CgProfile className='text-slate-950' size={200}/></AvatarFallback>
                        </Avatar>
                        <label htmlFor="profilePictureInput"
                               className="bg-slate-900 text-[1rem] w-1/2 border-2 border-slate-50 font-medium flex justify-center items-center gap-1 text-slate-50 rounded-md h-10 cursor-pointer transition-all duration-300 transform active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50">
                            Select Profile Picture
                        </label>
                        <input id="profilePictureInput" type="file" onChange={handleFileChange} className="hidden"
                               accept="image/*"/>
                    </div>
                    {/* Company Name Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="companyName" className='text-slate-50'>Company
                            Name</Label>
                        <Input id="companyName" Icon={<MdOutlineAlternateEmail size={20}/>}
                               type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                               placeholder="Company Name"
                               className='text-slate-50 bg-slate-900 placeholder:text-slate-400'/>
                    </LabelInputContainer>
                    {/* Industry Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="industry" className='text-slate-50'>Industry</Label>
                        <Input id="industry" Icon={<MdOutlineAlternateEmail size={20}/>}
                               type="text" name="industry" value={formData.industry} onChange={handleChange}
                               placeholder="Industry"
                               className='text-slate-50 bg-slate-900 placeholder:text-slate-400'/>
                    </LabelInputContainer>
                    {/* Address Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="address" className='text-slate-50'>Address</Label>
                        <Input id="address"
                               onChange={handleChange}
                               value={formData.address}
                               name="address"
                               placeholder="Lohore"
                               type="text" className='text-slate-50 bg-slate-900 placeholder:text-slate-400'/>
                    </LabelInputContainer>
                    {/* Contact Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="contact" className='text-slate-50'>Contact</Label>
                        <Input id="contact" Icon={<MdOutlineAlternateEmail size={20}/>}
                               onChange={handleChange}
                               value={formData.contact}
                               name="contact"
                               placeholder="+923001234567"
                               type="text" className='text-slate-50 bg-slate-900 placeholder:text-slate-400'/>
                    </LabelInputContainer>
                    {/* Profession Input */}

                    <LabelInputContainer className="mb-4">

                        <Label htmlFor="profession" className='text-slate-50'>Designation / Profession</Label>
                        <Input
                            id="profession"
                            Icon={<MdOutlineAlternateEmail size={20}/>}
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            placeholder="Busniess Development"
                            className='text-slate-50 bg-slate-900 placeholder:text-slate-400'
                        />
                    </LabelInputContainer>
                    {/* Company Description Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="companyDescription" className='text-slate-50'>Company
                            Description</Label>
                        <Textarea id="companyDescription" Icon={<MdOutlineAlternateEmail size={20}/>}
                                  onChange={handleChange}
                                  value={formData.companyDescription}
                                  placeholder="Write here..." name="companyDescription"
                                  className='text-slate-50 bg-slate-900 placeholder:text-slate-400 mt-4'/>

                    </LabelInputContainer>
                    {/* Website URL Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="websiteURL" className='text-slate-50'>Website
                            URL</Label>
                        <div className="relative flex justify-center items-center">
                            <Input id="websiteURL"
                                   onChange={handleChange}
                                   value={formData.websiteURL}
                                   name="websiteURL"
                                   placeholder="www.example.com"
                                   type="url" className='text-slate-50 bg-slate-900 placeholder:text-slate-400 pl-8'/>
                            <span
                                className="absolute inset-y-0 left-0 flex items-center justify-center pl-2"><MdInsertLink
                                className="text-slate-50"/></span>
                        </div>
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="facebookURL" className='text-slate-50'>Facebook
                            URL</Label>
                        <div className="relative flex justify-center items-center">
                            <Input id="facebookURL"
                                   onChange={handleChange}
                                   value={formData.facebookURL}
                                   name="facebookURL"
                                   placeholder="www.facebook.com/example"
                                   type="url" className='text-slate-50 bg-slate-900 placeholder:text-slate-400 pl-8'/>
                            <span
                                className="absolute inset-y-0 left-0 flex items-center justify-center pl-2"><ImFacebook2
                                className="text-slate-50"/></span>
                        </div>
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="instagramURL" className='text-slate-50'>Instagram
                            URL</Label>
                        <div className="relative flex justify-center items-center">
                            <Input id="instagramURL"
                                   onChange={handleChange}
                                   value={formData.instagramURL}
                                   name="instagramURL"
                                   placeholder="www.instagram.com/example"
                                   type="url" className='text-slate-50 bg-slate-900 placeholder:text-slate-400 pl-8'/>
                            <span
                                className="absolute inset-y-0 left-0 flex items-center justify-center pl-2"><FaInstagramSquare
                                className="text-slate-50"/></span>
                        </div>
                    </LabelInputContainer>
                    {/* Twitter URL Input */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="instagramURL" className='text-slate-50'>Twitter
                            URL</Label>
                        <div className="relative flex justify-center items-center">
                            <Input id="twitterURL"
                                   onChange={handleChange}
                                   value={formData.twitterURL}
                                   name="twitterURL"
                                   placeholder="www.twitter.com/example"
                                   type="url" className='text-slate-50 bg-slate-900 placeholder:text-slate-400 pl-8'/>
                            <span
                                className="absolute inset-y-0 left-0 flex items-center justify-center pl-2"><FaXTwitter
                                className="text-slate-50"/></span>
                        </div>
                    </LabelInputContainer>
                    {/* Submit Button */}
                    <button
                        className="bg-slate-50 text-[1rem] flex justify-center items-center gap-1 dark:bg-zinc-800 w-full text-slate-950 rounded-md h-10 font-medium transition-all duration-300 transform disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-900 hover:bg-slate-950 hover:border-slate-50 hover:border-2 hover:text-slate-50"
                        onClick={handleSubmit} disabled={isLoading ? true : false}
                    >
                        {isLoading ? <div className='flex justify-center items-center'>
                            <ImSpinner2 size={20} className="animate-spin mr-2"/>
                            Please wait
                        </div> : <div className='flex gap-1 justify-center items-center'>
                            Submit
                            <PiSignInBold size={20}/>
                        </div>}
                    </button>
                </div>

            </form>
        </>

    );
}

export default EmployerDetailsForm;

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

