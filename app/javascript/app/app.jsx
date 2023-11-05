"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./app.scss";
import { Navigate, useLocation, useParams } from "react-router";
import HomeComponent from "./components/pages/home/home.component";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderBar from "./components/shared/header/header";

import {useNavigate} from "react-router";
import Router from "./Routes";

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
    <div className={!showNavbar?"outer-form-div":""}>
       <HeaderBar />
        <Router />
      <ToastContainer theme="colored"
                      hideProgressBar={true}
                      autoClose={3000}


      />
    </div>
  );
}

export default App;
