import React from 'react';

import {useNavigate,useLocation} from "react-router";

import {useEffect} from "react";

const RedirectionComponent=()=>{
     const navigate=useNavigate();
     const {pathname}=useLocation();


    useEffect(() => {
        navigate('/form')
    }, []);
        return(
            <div>
                
            </div>
        )
}

export  default  RedirectionComponent;