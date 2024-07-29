"use client";

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import FullPageLoader from "@/components/ui/FullPageLoader";
import {useAppContext} from "@/Context/Candidate_Employer_Data";
import ComponentLoader from "@/components/ui/ComponentLoader";

async function RedirectToHome({children}) {
    const {candidate} = useAppContext();
    const router = useRouter();
    const {data: session, status} = useSession();

    if (status === "loading" && !session) {
        return <ComponentLoader/>
    }
    if (typeof window !== "undefined" && !session && !candidate.id){
        await router.replace("/candidate/reset-password");
        return null;
    }
    else {
        return <div>{children}</div>
    }
}

export default RedirectToHome;