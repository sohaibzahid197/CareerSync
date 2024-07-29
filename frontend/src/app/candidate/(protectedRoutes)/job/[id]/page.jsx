'use client'
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/Context/Candidate_Employer_Data';
import Image from 'next/image';
import Link from 'next/link';
import Chatbot from '@/components/chatbotComponent/Chatbot';
import Metric from "@/components/ui/Metric";
import {employmentTypeConverter, getFormattedSalary} from "@/lib/utils";

function Page({ params }) {
    const [job, setJob] = useState(null);
    const { jobsData } = useAppContext();

    useEffect(() => {
        async function fetchJobs() {
            const fetchJob = await jobsData.find((job) => job.job_id === decodeURIComponent(params.id));
            setJob(fetchJob);
        }

        fetchJobs();
    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-8 lg:px-12">
            <div className="w-full space-y-8 bg-slate-50 p-8 rounded-lg shadow-lg">
                {job && (
                    <>
                        <h2 className="text-center text-3xl font-bold text-slate-950">{job.job_title}</h2>
                        <div className="flex items-center justify-center">
                            {job.employer_logo ? (
                                <Image
                                    className="object-cover rounded-full"
                                    height={100}
                                    width={100}
                                    src={job.employer_logo}
                                    alt={job.employer_name}
                                />
                            ) : (
                                <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center">
                                    <span className="text-slate-50 text-2xl">{job.employer_name.slice(0, 2).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-center text-slate-950 font-bold">{job.employer_name}</p>
                        <div className="divide-y divide-gray-200">
                            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                                <div
                                    className="flex flex-col md:flex-row items-center gap-3 max-sm:flex-wrap justify-center">
                                    {job.job_employment_type && <Metric
                                        imgUrl="/briefcase.svg"
                                        alt="briefcase"
                                        value={employmentTypeConverter(job.job_employment_type.toLowerCase())}
                                        textStyles="small-medium text-light-500"
                                        className="w-full md:w-auto"
                                    />}
                                    {job.job_is_remote && <Metric
                                        imgUrl="/people.svg"
                                        alt="people"
                                        value={job.job_is_remote ? "Remote" : "On-Site"}
                                        textStyles="small-medium text-light-500"
                                        className="w-full md:w-auto"
                                    />}
                                    {job.job_min_salary && job.job_max_salary && job.job_salary_currency && job.job_salary_period &&
                                        <Metric
                                            imgUrl="/currency-dollar-circle.svg"
                                            alt="dollar circle"
                                            value={getFormattedSalary({
                                                min: job.job_min_salary,
                                                max: job.job_max_salary,
                                                currency: job.job_salary_currency,
                                                period: job.job_salary_period,
                                            }) || "TBD"}
                                            textStyles="small-medium text-light-500"
                                            className="w-full md:w-auto"
                                        />}
                                </div>
                            </div>

                            {job.job_description && (
                                <div className="py-4">
                                    <h3 className="text-lg font-bold">Job Description</h3>
                                    <p className="text-slate-950">{job.job_description}</p>
                                </div>
                            )}
                            {job.job_highlights.Qualifications && (
                                <div className="py-4">
                                    <h3 className="text-lg font-bold">Qualifications</h3>
                                    <ul className="list-disc list-inside text-slate-950">
                                        {job.job_highlights.Qualifications.map((qualification, index) => (
                                            <li key={index}>{qualification}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {job.job_highlights.Responsibilities && (
                                <div className="py-4">
                                    <h3 className="text-lg font-bold">Responsibilities</h3>
                                    <ul className="list-disc list-inside text-slate-950">
                                        {job.job_highlights.Responsibilities.map((responsibility, index) => (
                                            <li key={index}>{responsibility}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {job.job_highlights.Benefits && (
                                <div className="py-4">
                                    <h3 className="text-lg font-bold">Benefits</h3>
                                    <ul className="list-disc list-inside text-slate-950">
                                        {job.job_highlights.Benefits.map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <Link
                            href={job.job_apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full mt-4 bg-blue-500 hover:bg-blue-600 text-slate-50 font-semibold py-2 px-4 rounded-lg text-center"
                        >
                            Apply Now
                        </Link>
                        <Chatbot question={"Kindly analyze the following Job description " +
                            "and other jobs things and help" +
                            " me for preparing the interview by give giving expected" +
                            " and frequently asked questions (technicals + basic) with answers." +
                            "Format should be bullet points of Questions and Answers" +
                            "" + job.job_description + " " + job.job_highlights?.Qualifications
                            + " " + job.job_highlights?.Responsibilities}/>
                    </>
                )}
            </div>
        </div>
    );
}

export default Page;
