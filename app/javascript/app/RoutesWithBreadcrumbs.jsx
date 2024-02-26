import React from 'react';
import {Outlet, useLocation} from "react-router";
import './routes-with-breadcrumbs.scss'
import Breadcrumbs from '../app/components/shared/breadcrumbs/Breadcrumbs'
import AdminBreadcrumbs from "./components/shared/breadcrumbs/AdminBreadcrumbs";

const RoutesWithBreadcrumbs = () => {
    const {pathname}=useLocation();
    function conditionalBreadcrumbs(){
        if(pathname.startsWith('/events')){
            return <AdminBreadcrumbs/>    /** render this breadcrumbs if we are on admin side*/
        }
        return <Breadcrumbs/>
    }

    return (
        <div className={"routes-with-breadcrumbs-main-container"}>
            <div className={"inner-container"}>
                {conditionalBreadcrumbs()}
                <Outlet/>
            </div>

        </div>
    )
}


export default RoutesWithBreadcrumbs;