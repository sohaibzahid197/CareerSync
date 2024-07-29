'use client'
import React from 'react';
import ComplexNavbar from "@/components/ui/Navbar";
import { CgProfile } from "react-icons/cg";
import { FiHelpCircle } from "react-icons/fi";
import { FaSignOutAlt, FaUserTie, FaBriefcase, FaBookmark } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";

import CandidateHeroSection from "@/components/dashboardComponents/CanidateHeroSection";
import RecommendedJobs from "@/components/dashboardComponents/RecommendedJobs";
import {Footer} from "@/components/ui/Footer";


function Layout({children}) {
    const profileMenuItems = [
        {
            label: "My Profile",
            href: "/candidate/profile",
            icon: <CgProfile size={18}/>,
        },
        {
            label: "Test Scores",
            href: "/candidate/dashboard/test-scores",
            icon: <MdAssessment size={18}/>,
        },
        {
            label: "Sign Out",
            href: "/candidate/signin",
            icon: <FaSignOutAlt size={18}/>,
        },
    ];
    const navListItems = [
        {
            label: "Find Jobs",
            href: "/candidate/dashboard/search-jobs",
            icon: <FaUserTie size={18}/>

        },
        {
            label: "My Portfolio",
            href: "/candidate/portfolio",
            icon: <FaBriefcase size={18}/>,
        },
        {
            label: "Saved Jobs",
            href: "/candidate/saved-jobs",
            icon: <FaBookmark size={18}/>,
        },
        {
            label: "Self Assessment",
            href: "https://careersync-self-assessment.vercel.app/",
            icon: <MdAssessment size={18}/>

        },
    ];

    return (
        <>
            <ComplexNavbar profileMenuItems={profileMenuItems} navListItems={navListItems}/>
            {children}
            <Footer/>
        </>
    );
}

export default Layout;