'use client'
import React from 'react';
import ComplexNavbar from "@/components/ui/Navbar";
import { CgProfile } from "react-icons/cg";
import { FiHelpCircle } from "react-icons/fi";
import { FaSignOutAlt, FaUserTie, FaBriefcase, FaBookmark } from "react-icons/fa";
import CandidateHeroSection from "@/components/dashboardComponents/CanidateHeroSection";
import RecommendedJobs from "@/components/dashboardComponents/RecommendedJobs";
import {Footer} from "@/components/ui/Footer";


function Page(props) {
    return (
        <>
            <CandidateHeroSection/>
            <RecommendedJobs/>
        </>
    );
}

export default Page;