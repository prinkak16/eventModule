'use client'

import React from "react";
import {Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './app.scss';
import {Navigate} from "react-router";
import HomeComponent from "./modules/home/home.component";
import FormComponent from "./modules/form/form.component";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateEvent from "./modules/create_event/createEvent";
import HeaderBar from "./modules/header/header";
import Header from "./modules/header/header";

function App() {

    return (
        <>
            <ToastContainer/>

            <HeaderBar/>

            <Routes>
                <Route path='/*' element={<Navigate to="/"/>}/>
                <Route path='/' element={<HomeComponent/>}/>
                <Route path='/form' element={<FormComponent/>}/>
                <Route path='/create_event' element={<CreateEvent/>}/>
            </Routes>
        </>
    );
}

export default App;
