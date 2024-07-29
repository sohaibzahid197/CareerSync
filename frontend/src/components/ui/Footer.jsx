'use client'
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export function Footer() {
    return (
        <footer className="w-full bg-slate-950 gap-2 flex justify-center items-center p-8">
            <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
                <Link href={"/"}>
                    <Image src={'/Logo-White.svg'} height={70} width={70} alt="CareerSync"/>
                </Link>
            </div>
            <hr className="my-8 border-blue-gray-50" />
            <Typography color="blue-gray" className="text-center font-normal text-slate-50">
                &copy; 2024 CareerSync. All rights reserved.
            </Typography>
        </footer>
    );
}