import React from 'react';
import EmployerAuth from "@/components/authComponents/EmployerAuth";

export default function EmployerAuthLayout({children}) {
    return <EmployerAuth> {children} </EmployerAuth>
}
