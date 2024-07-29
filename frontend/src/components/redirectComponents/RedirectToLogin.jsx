"use client";

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import FullPageLoader from "@/components/ui/FullPageLoader";
import {useAppContext} from "@/Context/Candidate_Employer_Data";

async function RedirectToLogin({children}) {
    const {candidate} = useAppContext();
    const router = useRouter();
    const {data: session, status} = useSession();

    if (status === "loading" && !session) {
        return <FullPageLoader/>
    }
    if (typeof window !== "undefined" && !session && !candidate.id){
        console.log("Redirecting", router);
        await router.replace("/candidate/signin");
        return null;
    }
    else {
        return <div>{children}</div>
    }
}

export default RedirectToLogin;