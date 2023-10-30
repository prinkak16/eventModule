"use client";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./app.scss";
import { Navigate, useLocation, useParams } from "react-router";
import HomeComponent from "./components/pages/home/home.component";
// import FormComponent from "./components/pages/form/form.component";

import FormComponent from "./components/pages/form/form.component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateEvent from "./components/pages/events/create-events/createEvent";
import HeaderBar from "./components/shared/header/header";
import Header from "./components/shared/header/header";
import FormSubmission from "./components/pages/form/FormSubmission";
import EditEvent from "./components/pages/events/edit-events/EditEvent";
import {useNavigate} from "react-router";

const paths = ["form"];
function App() {
  const navigate=useNavigate();
  const { pathname } = useLocation();
  console.log("pathname is", pathname);

  const [showNavbar, setShowNavbar] = useState(true);

  const toggleNavbar = () => {
    const isValid = paths.some((item) => pathname.includes(item));
    console.log("isvalid is ", isValid);
    if (isValid) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  };

  useEffect(() => {
    toggleNavbar();
  }, [pathname]);

 
  return (  
    <>
      <ToastContainer />

      {showNavbar && <HeaderBar />}

      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/events" element={<HomeComponent />} />
        <Route path="/form" element={<FormComponent />} />
        <Route path="/form/submissions/:event_id" element={<FormSubmission />} />

        <Route path="/event/create_event" element={<CreateEvent />} />
        <Route path="/event/edit_event/:id" element={<EditEvent />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
