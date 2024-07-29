'use client'

import React from 'react';
import ComplexNavbar from "@/components/ui/Navbar";
import {
    CodeBracketSquareIcon,
    CubeTransparentIcon,
    LifebuoyIcon,
    PowerIcon,
    UserCircleIcon
} from "@heroicons/react/24/solid";
import {CgProfile} from "react-icons/cg";
import {FiHelpCircle} from "react-icons/fi";
import {FaBookmark, FaBriefcase, FaSignOutAlt, FaUserTie} from "react-icons/fa";
import CandidateHeroSection from "@/components/dashboardComponents/CanidateHeroSection";
import {Footer} from "@/components/ui/Footer";
import {usePathname} from "next/navigation";
import RecommendedCandidatesSection from "@/components/dashboardComponents/RecommendedCandidatesSection";

function Page() {
    return (
        <>
            <CandidateHeroSection/>
            <RecommendedCandidatesSection/>
        </>

    );
}

export default Page;