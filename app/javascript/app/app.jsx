"use client";

import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./app.scss";
import { Navigate } from "react-router";
import HomeComponent from "./components/pages/home/home.component";
import FormComponent from "./components/pages/form/form.component";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateEvent from "./components/pages/events/create-events/createEvent";
import HeaderBar from "./components/shared/header/header";
import Header from "./components/shared/header/header";
import EditEvent from "./components/pages/events/edit-events/EditEvent";

function App() {
  return (
    <>
      <ToastContainer />

      <HeaderBar />

      <Routes>
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/" element={<HomeComponent />} />
        <Route path="/form" element={<FormComponent />} />

        <Route path="/create_event" element={<CreateEvent />} />
        <Route path="/edit_event" element={<EditEvent />} />
      </Routes>
    </>
  );
}

export default App;
