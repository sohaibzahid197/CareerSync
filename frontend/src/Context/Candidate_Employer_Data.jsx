'use client'
import React, {createContext, useState} from 'react';

export const AppContext = createContext(null);

function CandidateEmployerData({children}) {
    const [candidate, setCandidate] = useState({
        id: "",
        email: "",
    });
    const [employer, setEmployer] = useState({
        id: "",
        email: "",
    });
    const [candidateData, setCandidateData] = useState({});
    const [employerData, setEmployerData] = useState({});
    const [jobsData, setJobsData] = useState(null);
    const [candidateCardData, setCandidateCardData] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <AppContext.Provider value={{candidateData, setCandidateData, employer, setEmployer, candidate, setCandidate,
        drawerOpen, setDrawerOpen, jobsData, setJobsData, candidateCardData, setCandidateCardData}}>
            {children}
        </AppContext.Provider>
    );

}

export default CandidateEmployerData;

export function useAppContext() {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContext');
    }
    return context;
}

