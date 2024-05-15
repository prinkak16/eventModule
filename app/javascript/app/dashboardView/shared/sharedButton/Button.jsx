import React from "react"
import Button from "@mui/material/Button";
export default function SharedButton({buttonText}) {
    return(
        <>
            <Button variant="outlined" className="call-btn">{buttonText}</Button>
        </>
    )
}