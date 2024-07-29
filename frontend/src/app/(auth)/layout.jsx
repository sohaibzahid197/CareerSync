import React from 'react';
import Double from "@/components/GlobalLayout/Double";

export default function AuthLayout({children}) {
    return <Double>
        {children}
    </Double>
}