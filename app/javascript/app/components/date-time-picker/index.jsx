import React, {useState} from 'react';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {TextField} from "@mui/material";
import dayjs from "dayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

const ReactDateTimePicker=({minDate,minDateTime,maxDate,value,ampm,onChange,maxDateTime,disabled,title,required})=>{
    const [open,setOpen]=useState(false);
    const handleChange=(e)=>{
        onChange(e);
    }
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    sx={{width:"100%"}}
                    open={open}
                    onClose={() => setOpen(false)}
                    closeOnSelect={false}
                    ampm={ampm}
                    slotProps={{
                        field: {
                            readOnly: true
                        },
                        textField: {
                            onClick: () => setOpen(true),
                        },
                    }}
                    required={true}
                    label={<span>
                   {title}{' '}
                        {required&&<span style={{color: 'red'}}>*</span>}
                     </span>}
                    value={value}
                    disabled={disabled}
                    minDateTime={minDateTime}
                    maxDateTime={maxDateTime}
                    onChange={handleChange}
                />

        </LocalizationProvider>

    )
}
export  default ReactDateTimePicker;