import React from 'react';
import './error-fallback.scss'
import Button from "@mui/material/Button";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ErrorFallback=({error,resetErrorBoundary})=>{
    return (
        <div className={"error-fallback-main-container"}>
            <div className={"inner-container"}>
                <div className={"icon-container"}>
                   <WarningAmberIcon className={"icon"}/>
                </div>
                <h2>Something went wrong:</h2>
                <pre style={{color: "red"}}>{error.message}</pre>
                <Button variant={"contained"} onClick={resetErrorBoundary}>Try Again</Button>
            </div>
        </div>
    );
}
export default ErrorFallback;