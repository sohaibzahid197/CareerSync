'use client'
import React from "react";
import {
    Drawer,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";
import {useAppContext} from "@/Context/Candidate_Employer_Data";
import Link from "next/link";



export function MobileDrawer({navItems}) {
    const {drawerOpen, setDrawerOpen} = useAppContext();
    const MenuList = {

    }
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <React.Fragment>
            <Drawer open={drawerOpen} className={'w-1/2'} onClose={closeDrawer}>
                <div className="mb-2 flex items-center justify-end p-4">
                    <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>
                <List className={'min-w-max'}>
                    {navItems.map((item, index) => (
                        <ListItem key={index} className={'min-w-max'}>
                            <ListItemPrefix>
                                {item.icon}
                            </ListItemPrefix>
                            <Link href={item.href}>
                                {item.label}
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </React.Fragment>
    );
}