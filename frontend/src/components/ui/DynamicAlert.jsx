import React from 'react';
import {GrStatusGood} from "react-icons/gr";
import { MdOutlineError } from "react-icons/md";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TiWarning} from "react-icons/ti";

function DynamicAlert({title, alertMessage}) {
    return (
        <Alert
            className={`absolute w-[90%] top-0 bg-slate-50 text-slate-950 transform translate-y-5 animate-in`}
        >
            {title === 'Success' ? <GrStatusGood size={15}/> : title === 'Warning' ? <TiWarning size={15}/> : <MdOutlineError size={15}/>}
            <AlertTitle className='font-bold'>{title}</AlertTitle>
            <AlertDescription>
                {alertMessage}
            </AlertDescription>
        </Alert>
    );
}

export default DynamicAlert;