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

function Layout({children}) {
    const profileMenuItems = [
        {
            label: "My Profile",
            icon: <CgProfile size={18}/>
        },
        {
            label: "Help",
            icon: <FiHelpCircle size={18}/>,
        },
        {
            label: "Sign Out",
            icon: <FaSignOutAlt size={18}/>,
        },
    ];
    const navListItems = [
        {
            label: "Find Candidates",
            href: "/employer/dashboard/search-candidates",
            icon: <FaUserTie size={18}/>

        },
        {
            label: "Interview History",
            href: "/employer/InterviewHistory",
            icon: <FaBriefcase size={18}/>,
        },
        {
            label: "Saved Candidates",
            href: "/employer/saved-candidates",
            icon: <FaBookmark size={18}/>,
        },
    ];

    return (
        <>
            <ComplexNavbar navListItems={navListItems} profileMenuItems={profileMenuItems}/>
            {children}
            <Footer/>
        </>

    );
}

export default Layout;