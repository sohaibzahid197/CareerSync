'use client'
import React, {useEffect} from 'react';
import CandidateHeroSection from "@/components/dashboardComponents/CanidateHeroSection";
import {useSearchParams} from "next/navigation";
import {candidatesData} from "@/lib/dummyData";
import {CandidateCard} from "@/components/ui/bento-grid";
import {cn, getCountryCode} from "@/lib/utils";
import {ImSpinner2} from "react-icons/im";
import {Button, IconButton} from "@material-tailwind/react";
import {ArrowLeftIcon, ArrowRightIcon} from "@radix-ui/react-icons";
import {allCandidates, getMostRecommendedCandidates, getSearchedCandidates} from "@/lib/JobSearch";

function Page() {
    const params = useSearchParams();
    const [searchedCandidates, setSearchedCandidates] = React.useState(null);
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
    const currentData = searchedCandidates && searchedCandidates.slice(startIndex, endIndex);

    useEffect(() => {
        if(params.size !== 0){
            async function getCandidateResult(search, location){
                const realTimeCandidateData = await allCandidates()
                //const mostRecommendedCandidates = await getSearchedCandidates(realTimeCandidateData, search. location) //Replace with actual search and location
                const mostRecommendedCandidates = realTimeCandidateData.filter(candidate =>
                    candidate.profession.toLowerCase().includes(search.toLowerCase()) && candidate.preferredJobLocation.toLowerCase().includes(location.toLowerCase())
                );
                console.log("Most Recommended Candidates", mostRecommendedCandidates)
                setSearchedCandidates(mostRecommendedCandidates);
            }
            getCandidateResult(params.get('search'), params.get('location'));
        }
    }, [params.size]);


    return (<>
            <CandidateHeroSection/>
            <div className={'w-screen px-8 md:px-12 lg:px-16'}>
                <div className={'flex flex-col gap-3 w-full justify-center items-center'}>
                    {params.size === 0 ?
                        <div className='w-auto h-44 flex justify-center items-center'><h1 className={'text-slate-50'}>Type to search</h1></div> : <>
                            <div
                                className={'flex flex-col lg:flex-row gap-5 md:justify-between w-full items-center mt-8'}>
                            <h2 className={cn('text-3xl w-full font-bold text-center md:text-left text-slate-50 dark:text-neutral-100', 'mt-10 mb-4')}>
                                Searched Candidates
                            </h2>
                        </div>
                        <div className="flex w-full flex-col gap-3">
                            {!currentData ? (<ImSpinner2 size={30}
                                                         className="animate-spin w-full text-slate-50"/>) : <div
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-5 items-center">
                                {(currentData.map(async (candidateItem, index) => {
                                    const [city, state, country] = candidateItem.preferredJobLocation.split(',').map(item => item.trim());
                                    const countryCode = await getCountryCode(country)
                                    return (<div className="p-2 md:p-5 w-full md:basis-1/3" key={candidateItem._id}>
                                        <CandidateCard
                                            id={candidateItem._id}
                                            saved={false}
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
                                disabled={currentPage === Math.ceil(searchedCandidates ? searchedCandidates.length / itemsPerPage : 1)}
                            >
                                Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
                            </Button>
                        </div>
                    </>}

                </div>
            </div>
        </>

    );
}

export default Page;