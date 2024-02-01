import React from 'react';
import {Outlet} from "react-router";
import './routes-with-breadcrumbs.scss'
import Breadcrumbs from '../app/components/shared/breadcrumbs/Breadcrumbs'

const RoutesWithBreadcrumbs = () => {
    return (
        <div className={"routes-with-breadcrumbs-main-container"}>
            <div className={"inner-container"}>
                <Breadcrumbs/>
                <Outlet/>
            </div>

        </div>
    )
}


export default RoutesWithBreadcrumbs;