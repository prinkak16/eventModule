import React from 'react'
import {Route, Routes} from "react-router-dom";
import RedirectionComponent from "../RedirectionComponent";
import HomeComponent from "./components/pages/home/home.component";
import FormComponent from "./components/pages/form/form.component";
import FormSubmission from "./components/pages/form/FormSubmission";
import CreateEvent from "./components/pages/events/create-events/createEvent";
import EditEvent from "./components/pages/events/edit-events/EditEvent";
import {Navigate} from "react-router";

const Router=()=>{
    return(
        <Routes >
            <Route path="/" element={<RedirectionComponent />} />
            <Route path="/events" element={<HomeComponent />} />
            <Route path="/form" element={<FormComponent />} />
            <Route path="/form/submissions/:event_id" element={<FormSubmission />} />

            <Route path="/event/create_event" element={<CreateEvent />} />
            <Route path="/event/edit_event/:id" element={<EditEvent />} />
            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export  default Router;