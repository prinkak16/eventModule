import React from 'react'

import {Navigate, Outlet, useNavigate} from "react-router";


const ProtectedRoutes=()=>{
    const navigate = useNavigate();
    const isAuthenticated  = JSON.parse(document.getElementById("app").getAttribute("data-create"));
    if (!isAuthenticated) {
       return <Navigate  to="/forms" replace={true} />
    }
    return (
        <Outlet/>
    );
}

export  default ProtectedRoutes;
