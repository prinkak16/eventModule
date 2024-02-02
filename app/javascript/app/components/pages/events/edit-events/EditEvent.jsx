import React from "react";
import CreateEvent from "../create-events/createEvent";
import {useLocation} from "react-router";

const EditEvent = () => {
    const location = useLocation();
    return <CreateEvent editData={location?.state?.event ?? {}} isEdit={true}/>;
};

export default EditEvent;
