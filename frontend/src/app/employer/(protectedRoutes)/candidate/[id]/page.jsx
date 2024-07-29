'use client'
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@/Context/Candidate_Employer_Data';
import Image from 'next/image';
import Link from 'next/link';
import Metric from "@/components/ui/Metric";
import {Badge} from "@/components/ui/badge";
import {FaGithub, FaLink, FaUniversity} from "react-icons/fa";
import {SlCalender} from "react-icons/sl";
import {FaLocationDot} from "react-icons/fa6";
import {ImSpinner2} from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import {HOST} from "@/lib/utils";
import {MdDelete} from "react-icons/md";
import {usePathname, useRouter} from "next/navigation";
import {router} from "next/client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


function Page({params}) {
    const [candidate, setCandidate] = useState(null);
    const {candidateCardData} = useAppContext();
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [portfolio, setPortfolio] = useState(null);
    const [testName, setTestName] = useState('');
    const [score, setScore] = useState('');
    const path = usePathname();
    const router = useRouter();

    async function handlePortfolioTab() {
        setPortfolioShow(true);
        const response = await fetch(`${HOST}/candidate/getProjects/660a89b1c16089e0e1433a6b`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const {data} = await response.json();
        setPortfolio(data[0].projects);
    }

    useEffect(() => {
        async function fetchJobs() {
            const fetchCandidate = await candidateCardData.find((candidate) => candidate._id === decodeURIComponent(params.id));
            setCandidate(fetchCandidate);
        }

        fetchJobs();
    }, []);

    useEffect(() => {
        const url = window.location.href;
        console.log(url);
        const fragmentIndex = url.indexOf('#');
        if (fragmentIndex !== -1) {
            const fragment = url.substring(fragmentIndex + 1);
            if (fragment === 'portfolio-tab') handlePortfolioTab();
        }
    }, []);

    async function handleMeetings() {
        const response = await fetch(`${HOST}/api/zoom/meeting/?candidateEmail=${encodeURIComponent("dev.abubakarsiddique@gmail.com")}&employerEmail=${encodeURIComponent("hamzashafqat098@gmail.com")}`, {
            method: 'GET',
        });
        const data = await response.json();
        window.open(data.authUrl, '_blank');
    }
    async function handleUploadScore(email, testName, score) {
        if (score === '' || testName === '') {
            alert('Please fill in the test name and score');
            return;
        }
        const url = `${HOST}/post-scores/${email}`;
        const payload = {
            testName: testName,
            score: score
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Test result saved successfully:', data);
        } catch (error) {
            console.error('Error saving test result:', error);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-8 lg:px-12">
            <div className="w-full space-y-8 bg-slate-50 p-8 rounded-lg shadow-lg">
                {candidate && (
                    <>
                        <h2 className="text-center text-3xl font-bold text-slate-950">{candidate.fullName}</h2>
                        <div className="flex items-center justify-center">
                            {candidate.profilePictureUrl && (
                                <Image
                                    className="object-cover rounded-full border border-slate-950 p-2"
                                    height={150}
                                    width={150}
                                    src={candidate.profilePictureUrl}
                                    alt={candidate.fullName}
                                />
                            )}
                        </div>
                        <p className="text-center text-slate-950 font-bold">{candidate.profession}</p>
                        <p className="text-center text-slate-950 font-medium italic">{candidate.email}</p>
                        <div className="divide-y divide-gray-200">
                            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                                <div
                                    className="flex flex-col md:flex-row items-center gap-3 max-sm:flex-wrap justify-center mb-5">
                                    <Link className='w-full md:w-auto cursor-pointer' href={'https://cyan-bibbie-53.tiiny.site'} target={'_blank'}>
                                        <Metric
                                            imgUrl="/resume.svg"
                                            alt="briefcase"
                                            value={'Resume'}
                                            textStyles="small-medium text-light-500"
                                            className="w-full md:w-auto"
                                        />
                                    </Link>
                                    <div className='w-full md:w-auto cursor-pointer' onClick={handlePortfolioTab}>
                                        <Metric
                                            imgUrl="/portfolio.svg"
                                            alt="people"
                                            value={"Portfolio"}
                                            textStyles="small-medium text-light-500"
                                            className="w-full md:w-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                            {portfolioShow ?
                                <div id='portfolio-tab' className='flex flex-col justify-center items-center'>
                                    {!portfolio ? <ImSpinner2 size={30}
                                                              className="animate-spin w-full text-slate-950"/> :
                                        <>
                                            <div
                                                className='flex justify-center sm:justify-start w-full p-5 items-center'>
                                                <IoMdArrowRoundBack size={32} onClick={() => setPortfolioShow(false)}/>
                                            </div>

                                            <div
                                                className={`${portfolio.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 '} gap-4`}>
                                                {portfolio.map((project, index) => (
                                                    <div key={index}
                                                         className="mb-6 bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                                                        <div className="flex justify-center bg-black">
                                                            <div style={{
                                                                width: '100%',
                                                                paddingTop: '56.25%',
                                                                position: 'relative'
                                                            }}>
                                                                <img src={project.thumbnailUrl}
                                                                     alt={project.projectName} style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}/>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <h4 className="text-2xl font-semibold text-blue-400 mb-3">{project.projectName}</h4>
                                                            <p className="text-slate-50 mb-2">
                                                                <strong>Type:</strong> {project.projectType}</p>
                                                            <p className="text-slate-50 mb-4">
                                                                <strong>Description:</strong> {project.projectDescription}
                                                            </p>
                                                            <div
                                                                className='flex flex-col lg:flex-row gap-5 justify-center items-center'>
                                                                <Link href={project.repoUrl} target="_blank"
                                                                      className='w-full lg:w-auto'
                                                                      rel="noopener noreferrer">
                                                                    <button
                                                                        className="inline-flex rounded-lg w-full justify-center items-center px-4 py-2 bg-slate-950 text-white hover:bg-slate-900">
                                                                        <FaGithub className="mr-2"/>GitHub
                                                                    </button>
                                                                </Link>
                                                                <Link href={project.liveUrl} target="_blank"
                                                                      className='w-full lg:w-auto'
                                                                      rel="noopener noreferrer">
                                                                    <button
                                                                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-600">
                                                                        <FaLink className="mr-2"/>Live
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>}
                                </div> :
                                <>
                                    {candidate.education && (
                                        <div className="py-4">
                                            <h1 className="text-2xl font-bold text-center md:text-left">Education</h1>
                                            <div className="text-slate-950">
                                                {candidate.education.map((education, index) => (
                                                    <div
                                                        className='flex gap-1 flex-col mt-4 border-l-8 pl-3 rounded-md border-slate-950'
                                                        key={index}>
                                                        <p>{education.degree}</p>
                                                        <p className='flex flex-col md:flex-row gap-3 justify-between'>
                                                            <span className='font-bold flex gap-1'><FaUniversity
                                                                size={20}/>{education.universityName}</span>
                                                            <span className='flex gap-1'><SlCalender
                                                                size={20}/>{education.duration}</span>
                                                            <span className='flex gap-1'><FaLocationDot
                                                                size={20}/>{education.location}</span>
                                                        </p>
                                                        <p>{education.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {candidate.workExperiences && (
                                        <div className="py-4">
                                            <h3 className="text-2xl font-bold text-center md:text-left">Work
                                                Experiences</h3>
                                            <div className="text-slate-950">
                                                {candidate.workExperiences.map((experience, index) => (
                                                    <div
                                                        className='flex gap-1 flex-col mt-4 border-l-8 pl-3 rounded-md border-slate-950'
                                                        key={index}>
                                                        <p>{experience.title}</p>
                                                        <p className='flex flex-col md:flex-row gap-3 justify-between'>
                                                    <span className='font-bold flex gap-1'><FaUniversity
                                                        size={20}/>{experience.companyName}</span>
                                                            <span className='flex gap-1'><SlCalender
                                                                size={20}/>{experience.duration}</span>
                                                            <span className='flex gap-1'><FaLocationDot
                                                                size={20}/>{experience.location}</span>
                                                        </p>
                                                        <p>{experience.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {candidate.skills && (
                                        <div className="py-4">
                                            <h3 className="text-2xl font-bold text-center md:text-left">Skills</h3>
                                            <div
                                                className="flex justify-center items-center gap-2 text-slate-950 flex-wrap mt-4">
                                                {candidate.skills.map((skill, index) => (
                                                    <Badge key={index}
                                                           className="bg-slate-950 text-slate-50 font-semibold py-1 px-2 rounded-lg ">{skill}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        onClick={handleMeetings}
                                        className="block cursor-pointer w-full mt-4 bg-blue-500 hover:bg-blue-600 text-slate-50 font-semibold py-2 px-4 rounded-lg text-center"
                                    >
                                        Schedule Interview
                                    </div>
                                    <div className={'flex flex-col md:flex-row gap-3'}>
                                        <Link
                                            href={"https://app.testgorilla.com/customer/assessments?assessmentPage=0"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block cursor-pointer w-full mt-4 bg-blue-500 hover:bg-blue-600 text-slate-50 font-semibold py-2 px-4 rounded-lg text-center"
                                        >
                                            Taking Online Assessment
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className={'block cursor-pointer w-full mt-4 bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded-lg text-center'}>Upload Result</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Upload Result</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="name" className="text-right">
                                                            Test Name
                                                        </Label>
                                                        <input
                                                            id="name"
                                                            onChange={(e) => setTestName(e.target.value)}
                                                            placeholder="Software Development"
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="score" className="text-right">
                                                            Score
                                                        </Label>
                                                        <input
                                                            id="score"
                                                            onChange={(e) => setScore(e.target.value)}
                                                            placeholder="80%"
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">
                                                        <div onClick={() => handleUploadScore(candidate.email, testName, score)}>
                                                            Upload Score
                                                        </div>
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                </>
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Page;
