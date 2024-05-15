import React from "react"
import {TextField, MenuItem} from "@mui/material";
import "./selectField.scss";
export default function SelectField(){
    return(
        <>
            <div className="select-wrap">

            <TextField
                id="outlined-select-currency"
                select
                // label="Select"
                defaultValue="English"
                className="select-field"
            >

                    <MenuItem key="English" value="English">
                        English
                    </MenuItem>
            </TextField>
            </div>
        </>
    )
}