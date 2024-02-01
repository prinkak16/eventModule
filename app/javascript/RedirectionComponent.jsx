import React, {useEffect} from 'react';

import {useLocation, useNavigate} from "react-router";

const RedirectionComponent = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();


    useEffect(() => {
        navigate('/forms')
    }, []);
    return (
        <div>

        </div>
    )
}

export default RedirectionComponent;