'use client'
import {cn, getCountryCode} from "@/lib/utils";
import React, {useEffect} from "react";
import {CandidateCard, JobCard} from "@/components/ui/bento-grid";
import {Button, IconButton} from "@material-tailwind/react";
import {ArrowRightIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";

import {JobsFilter} from "@/components/dashboardComponents/JobsFilter";
import {ImSpinner2} from "react-icons/im";
import {allCandidates, getMostRecommendedCandidates, getMostRecommendedJobs, searchJobs} from "@/lib/JobSearch";
import {candidatesData, jobs, resumeData} from "@/lib/dummyData";
import {useAppContext} from "@/Context/Candidate_Employer_Data";
import Link from "next/link";

export default function JobsSection() {
    const [savedCandidate, setSavedCandidate] = React.useState(null);
    const [active, setActive] = React.useState(1);
    const [itemsPerPage] = React.useState(6);
    const [currentPage, setCurrentPage] = React.useState(1);

    const next = () => {
        if (active === 5) return;
        setActive(active + 1);
        setCurrentPage(currentPage + 1);
    };
    const numberButtonHandler = (index) => {
        setActive(index);
        setCurrentPage(index);
    }

    const prev = () => {
        if (active === 1) return;
        setActive(active - 1);
        setCurrentPage(currentPage - 1);
    };

    const getItemProps = (index) => ({
        variant: active === index ? "filled" : "text", color: "gray", onClick: () => setActive(index),
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = savedCandidate && savedCandidate.slice(startIndex, endIndex);
    function pickRandomElements(arr, n) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }
    useEffect(() => {
        async function getSavedCandidates(){
            const realTimeCandidateData = await allCandidates()
            //const mostRecommendedCandidates = await getMostRecommendedCandidates(realTimeCandidateData, "I want react/nextjs developer") //Replace with actual job description
            setSavedCandidate(pickRandomElements(realTimeCandidateData, 3));
        }
        getSavedCandidates();
    }, []);


    // const handleFilterChange = (filterOptions) => {
    //     console.log(filterOptions);
    //     const filtered = (searchedData || allJobs).filter((job) => {
    //         return (
    //             (filterOptions.showFullTime && job.job_employment_type.toLowerCase() === "fulltime") ||
    //             (filterOptions.showPartTime && job.job_employment_type.toLowerCase() === "parttime") ||
    //             (filterOptions.showContract && job.job_employment_type.toLowerCase() === "contractor") ||
    //             (filterOptions.showInternship && job.job_employment_type.toLowerCase() === "intern") ||
    //             (filterOptions.showRemote && job.job_is_remote) ||
    //             (filterOptions.showOnSite && !job.job_is_remote)
    //         );
    //     });
    //
    //     console.log(filtered)
    //     filtered.length === 0 ? setAllJobs(jobs.data) : setAllJobs(filtered);
    // };

    return (<div className={'w-screen px-8 md:px-12 lg:px-16'}>
        <div className={'flex flex-col gap-3 w-full justify-center items-center'}>
            <div className={'flex flex-col lg:flex-row gap-5 md:justify-between w-full items-center mt-8'}>
                <h2 className={cn('text-3xl w-full font-bold text-center md:text-left text-slate-50 dark:text-neutral-100', 'mt-10 mb-4')}>
                    All Saved Candidates
                </h2>
            </div>
            <div className="flex w-full flex-col gap-3">
                {!currentData ? (<ImSpinner2 size={30}
                                             className="animate-spin w-full text-slate-50"/>) :
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-5 items-center">
                        {(currentData.map(async (candidateItem, index) => {
                            const [city, state, country] = candidateItem.preferredJobLocation.split(',').map(item => item.trim());
                            const countryCode = await getCountryCode(country)
                            return (<div className="p-2 md:p-5 w-full md:basis-1/3" key={candidateItem._id}>
                                <CandidateCard
                                    id={candidateItem._id}
                                    saved={true}
                                    fullName={candidateItem.fullName}
                                    email={candidateItem.email}
                                    phone={candidateItem.phone}
                                    profession={candidateItem.profession}
                                    city={city}
                                    state={state}
                                    country={countryCode}
                                    skills={candidateItem.skills}
                                    workExperiences={candidateItem.workExperiences}
                                    education={candidateItem.education}
                                    imageUrl={candidateItem.profilePictureUrl}
                                />
                            </div>);
                        }))}
                    </div>}
            </div>

            <div className="flex items-center justify-center gap-4 mt-5 w-full">
                <Button
                    variant="text"
                    className="items-center justify-center gap-2 active:bg-slate-400 flex bg-slate-50 hover:bg-slate-200 text-slate-950  bg-opacity-100"
                    onClick={prev}
                    disabled={currentPage === 1}
                >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/> Prev
                </Button>
                <div className="flex items-center gap-2">
                    <IconButton
                        className={'items-center justify-center gap-2 active:bg-slate-400 flex bg-slate-50 hover:bg-slate-200 text-slate-950  font-bold bg-opacity-100'}
                        variant={'filled'}>
                        {currentPage}
                    </IconButton>
                </div>
                <Button
                    variant="text"
                    className="items-center justify-center gap-2 hover:bg-slate-200 active:bg-slate-400 flex bg-slate-50 text-slate-950 bg-opacity-100"
                    onClick={next}
                    disabled={currentPage === Math.ceil(savedCandidate ? savedCandidate.length / itemsPerPage : 1)}
                >
                    Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    </div>)
}

