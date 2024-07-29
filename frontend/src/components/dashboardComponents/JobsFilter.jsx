"use client"

import * as React from "react"
import {DropdownMenuCheckboxItemProps} from "@radix-ui/react-dropdown-menu"

import {Button} from "@/components/ui/button"
import {FaChevronDown} from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ImSpinner2} from "react-icons/im";


export function JobsFilter({onChangeFilter}) {
    const [showFullTime, setFullTime] = React.useState(false)
    const [showPartTime, setPartTime] = React.useState(false)
    const [showInternship, setInternship] = React.useState(false)
    const [showContract, setContract] = React.useState(false)
    const [showRemote, setRemote] = React.useState(false)
    const [showOnSite, setOnSite] = React.useState(false)

    const handleFilterChange = () => {
        console.log("Filter Changed", showFullTime, showPartTime, showInternship, showContract, showRemote, showOnSite)
        onChangeFilter({
            showFullTime,
            showPartTime,
            showInternship,
            showContract,
            showRemote,
            showOnSite,
        });
    };

    return (
        <div className={'flex flex-col md:flex-row justify-center items-center gap-5'}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={'flex justify-center items-center gap-2'}>
                        Employment Type
                        <FaChevronDown className="mr-2 h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                        checked={showFullTime}
                        onCheckedChange={setFullTime}
                    >
                        Full Time
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showPartTime}
                        onCheckedChange={setPartTime}
                    >
                        Part Time
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showInternship}
                        onCheckedChange={setInternship}
                    >
                        Internship
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showContract}
                        onCheckedChange={setContract}
                    >
                        Contract
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={'flex justify-center items-center gap-2'}>
                        Location Flexibility
                        <FaChevronDown className="mr-2 h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                        checked={showRemote}
                        onCheckedChange={setRemote}
                    >
                        Remote
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showOnSite}
                        onCheckedChange={setOnSite}
                    >
                        On-Site
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <button
                className="bg-slate-50 text-sm flex-0.5 w-full md:basis-1/6 px-6 py-2 outline-0 flex justify-center items-center gap-1 dark:bg-zinc-800 text-slate-950 rounded-full h-10 font-medium disabled:bg-slate-700 disabled:text-slate-300 disabled:border-none active:bg-slate-800 duration-300 transform transition-all active:text-slate-50 hover:bg-slate-950 hover:border-slate-50 border-2 hover:border-2 hover:text-slate-50"
                onClick={handleFilterChange}
            >
                <div className='flex gap-1 w-full justify-center items-center'>
                    Apply
                </div>
            </button>
        </div>

    )
}

