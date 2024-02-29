"use client";
import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./app.scss";
import {useLocation, useNavigate} from "react-router";

import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderBar from "./components/shared/header/header";
import Router from "./Routes";
import {createTheme, ThemeProvider} from "@mui/material";

const paths = ["forms",];
const theme = createTheme({
    typography: {
        fontFamily:'Quicksand',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'Quicksand';
          font-style: normal;
           }
      `,
        },
    },
});


function App() {
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const [showNavbar, setShowNavbar] = useState(true);

    const toggleNavbar = () => {
        const isValid = paths.some((item) => pathname.includes(item));
        if (isValid) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    };


    const customToastStyle = {
        minWidth: "40%",
        maxWidth: "100%",
    };
    useEffect(() => {
        toggleNavbar();
    }, [pathname]);


    return (
        <div className={!showNavbar ? "outer-form-div" : ""}>
            <ThemeProvider theme={theme}>
                <HeaderBar/>
                <Router/>
                <ToastContainer theme="colored"
                                hideProgressBar={true}
                                autoClose={3000}
                                closeOnClick
                                pauseOnHover
                                style={customToastStyle}
                />
            </ThemeProvider>

        </div>
    );
}

export default App;
