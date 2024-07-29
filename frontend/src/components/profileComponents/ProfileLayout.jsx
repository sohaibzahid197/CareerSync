'use client'
import React from 'react';
import Single from "@/components/GlobalLayout/Single";
import {BackgroundGradient} from "@/components/ui/background-gradient";

function ProfileLayout({children}) {
    return (
        <Single>
            <BackgroundGradient className="rounded-3xl flex justify-center items-center p-4 h-full w-[80vw] md:w-[40vw] bg-slate-950">
                {children}
            </BackgroundGradient>
        </Single>
    );
}

export default ProfileLayout;