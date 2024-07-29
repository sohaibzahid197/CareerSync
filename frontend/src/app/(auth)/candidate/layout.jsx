import React from "react";
import CandidateAuth from "@/components/authComponents/CandidateAuth";


export default function CandidateAuthLayout({children}) {

    return (
        <CandidateAuth>
            {children}
        </CandidateAuth>
    );
}
