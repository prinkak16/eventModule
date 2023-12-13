import React from 'react'
import {Route, Routes} from "react-router-dom";
import RedirectionComponent from "../RedirectionComponent";
import HomeComponent from "./components/pages/home/home.component";
import FormComponent from "./components/pages/form/form.component";
import FormSubmission from "./components/pages/form/FormSubmission";
import CreateEvent from "./components/pages/events/create-events/createEvent";
import EditEvent from "./components/pages/events/edit-events/EditEvent";
import {Navigate} from "react-router";

import ViewEvents from "./components/pages/events/view-events/ViewEvents";
import ProtectedRoutes from "./ProtectedRoutes";
import RoutesWithBreadcrumbs from "./RoutesWithBreadcrumbs";
import EventDetails from "./components/pages/events/event-details/EventDetails";

const Router=()=>{
    return(
        
        <Routes >
            <Route path="/" element={<Navigate  to="/forms" replace={true} />} />
            <Route path="/forms" element={<FormComponent />} />
            <Route path="/forms/submissions/:event_id" element={<FormSubmission />} />



            <Route element={<ProtectedRoutes/>}>
                <Route path="/events" element={ <HomeComponent />} />
                <Route element={<RoutesWithBreadcrumbs/>}>
                    <Route path="/events/create/:id?" element={<CreateEvent />} />
                    <Route path="/events/edit/:id" element={<EditEvent />} />
                    <Route path="/events/view/:id"  element={<ViewEvents/>}/>

                    <Route path="/events/:id"  element={<EventDetails/>}/>

                </Route>
            </Route>
       <Route path="/*" element={<Navigate to="/" replace={true}  />} />
        </Routes>
    )
}

export  default Router;