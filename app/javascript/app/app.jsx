'use client'

import React from "react";
import {Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './app.scss';
import {Navigate} from "react-router";
import HomeComponent from "./modules/home/home.component";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    return (
        <>
            <ToastContainer />
            <Routes>
                <Route path='/*' element={<Navigate to="/"/>}/>
                <Route path='/' element={<HomeComponent/>}/>
            </Routes>
        </>
    );
}

export default App;
