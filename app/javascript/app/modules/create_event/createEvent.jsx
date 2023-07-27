import React, {useEffect, useRef, useState} from 'react';
import './createEvent.scss';
import {
    Autocomplete, Box, Button, createFilterOptions,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel, MenuItem, Modal,
    Radio,
    RadioGroup, Select,
    TextField, Typography
} from "@mui/material";
import dayjs, {Dayjs} from 'dayjs';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';


export default function CreateEvent() {
    const [dataLevels, setDataLevels] = useState([]);
    const [countryStates, setCountryStates] = useState([]);
    const [locations, setLocations] = useState([]);
    const [level, setLevel] = useState({});
    let isPradesh = useRef(false);
    // Form field values

    const [formFieldValue, setFormFieldValue] = useState({
        start_datetime: '',
        end_datetime: '',
        level_id: '',
        state: '',
        location_type: '',
        location_id: '',
        event_type: ''
    });
    const abc = {name: "ab", id: "1"};

    useEffect(() => {
        getDataLevels();
    }, [])

    async function getDataLevels() {
        let levels = await fetch("api/event/data_levels", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await levels.json();
       setDataLevels(res.data);
    }

    const handleLevelChange = (event, value) => {
        setLocations([]);
        formFieldValue.level_id = value.id
        setLevel(value)
        if (value.id) { getStates(); }
        isPradesh = value.name === 'Pradesh'
    }
    async function getStates() {
        let levels = await fetch("api/event/states", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await levels.json();
        setCountryStates(res.data);
        if (isPradesh) {setLocations(res.data);}
    }


    function setFormField(event, field){
        if (field === 'start_datetime' || field === 'end_datetime') {
            formFieldValue[field] = event.$d
        } else {
            formFieldValue[field] = event.target.value;
        }
    }

    const handleStateChange = (event, value) => {
       const level_name = level.name;
       const state_id = value.id;
       debugger
    }


    return (
        <div>
            <div className="container">
                <h3 className="font-weight-300">Create an Event</h3>
                <div className="event-create-form-bg">
                    <TextField id="outlined-basic"
                               onChange={(event) => setFormField(event, 'event_title')}
                               label="Event title" variant="outlined" className="w-100"/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                            <div className="d-flex justify-content-between">
                                <DateTimePicker
                                    label="Start date & Time *"
                                    className="w-49"
                                    onChange={(event) => setFormField(event, 'start_datetime')}
                                />
                                <DateTimePicker
                                    label="End date & Time *"
                                    className="w-49"
                                    onChange={(event) => setFormField(event, 'end_datetime')}
                                />
                            </div>
                        </DemoContainer>
                    </LocalizationProvider>
                    <p>Upload Image/ Banner:</p>
                    <div>
                        <input type="file" className="file-input"/>
                    </div>
                    <div className="mt-2">
                        <Autocomplete
                            options={dataLevels}
                            getOptionLabel={(option) => option.name || ""}
                            getOptionValue={(option) => option.id || ""}
                            className="w-100"
                            onChange={handleLevelChange}
                            renderInput={(params) => <TextField {...params} label="Select levels"/>}
                        />
                    </div>
                    {formFieldValue.level_id ? (
                        <>
                            {level.name !== 'Pradesh' ? (
                                <>
                                    <div className="mt-2">
                                        <Autocomplete
                                            className="w-100"
                                            value={}
                                            options={countryStates}
                                            getOptionLabel={(option) => option.name || ""}
                                            getOptionValue={(option) => option.id || ""}
                                            onChange={handleStateChange}
                                            renderInput={(params) => <TextField {...params} label={'Select state'}/>}
                                        />
                                    </div>
                                </>
                            ) : ( <> </> )}
                            <div className="mt-2">
                                <Autocomplete
                                    className="w-100"
                                    options={locations}
                                    getOptionLabel={(option) => option.name || ""}
                                    getOptionValue={(option) => option.id || ""}
                                    onChange={(event) => setFormField(event, 'location_id')}
                                    renderInput={(params) => <TextField {...params} label={'Select ' + level.name}/>}
                                />
                            </div>
                        </>
                    ) : ( <> </> )}
                    <div className="mt-2">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Reporting Target</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="open_event"
                                                  onChange={(event) => setFormField(event, 'event_type')}
                                                  control={<Radio />} label="Open event" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    )
}
