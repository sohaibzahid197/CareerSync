'use client'
import React from 'react';
import Single from "@/components/GlobalLayout/Single";
import {BackgroundGradient} from "@/components/ui/background-gradient";

function PortfolioLayout({children}) {
    return (
        <div className='p-10'>
            <BackgroundGradient className="rounded-3xl flex justify-center items-center h-full w-auto p-0 sm:p-3 lg:p-8 bg-slate-950">
                {children}
            </BackgroundGradient>
        </div>


        
    );
}

export default PortfolioLayout;