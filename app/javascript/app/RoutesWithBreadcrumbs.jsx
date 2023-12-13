import React from 'react';
import {Outlet} from "react-router";
import './routes-with-breadcrumbs.scss'
import Breadcrumbs  from  '../app/components/shared/breadcrumbs/Breadcrumbs'
import {useParams} from "react-router-dom";
const RoutesWithBreadcrumbs=()=>{
    return(
        <div className={"routes-with-breadcrumbs-main-container"}>
            <div style={{width:"100%"}}>
                <Breadcrumbs/>
                <Outlet/>
            </div>

        </div>
    )
}


export  default RoutesWithBreadcrumbs;