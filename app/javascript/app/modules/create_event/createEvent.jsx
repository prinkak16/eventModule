import React, {useEffect, useState, useRef} from 'react';
import './createEvent.scss';
import {
    Autocomplete,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import dayjs, {Dayjs} from 'dayjs';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {toast} from 'react-toastify';
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import Loader from "react-js-loader";


export default function CreateEvent() {
    const imgDefault = 'https://storage.googleapis.com/public-saral/public_document/upload-img.jpg';
    const imgCross = 'https://storage.googleapis.com/public-saral/public_document/icon.jpg';
    const nextBtn = 'https://storage.googleapis.com/public-saral/public_document/button.png'
    const navigate = useNavigate()
    const [dataLevels, setDataLevels] = useState([]);
    const [countryStates, setCountryStates] = useState([]);
    const [image, setImage] = useState()
    const [startDate, setStartDate] = useState()
    const location = useLocation();
    const [submittedData, setSubmittedData] = useState(location.state ? location.state.event : {})
    const [loader, setLoader] = useState(false)
    const [isEdit, setIsEdit] = useState(location.state)

    // Form field values
    const [formFieldValue, setFormFieldValue] = useState({
        event_title: isEdit ? submittedData.event_title : '',
        start_datetime: '',
        end_datetime: '',
        level_id: '',
        location_ids: [],
        event_type: '',
        img: '',
        event_id: '',
        state_obj: []
    });

    const requiredField = ['start_datetime']


    useEffect(() => {
        if (isEdit) {
            formFieldValue.event_id = submittedData.id;
            formFieldValue.event_title = submittedData.name;
            formFieldValue.img = submittedData.image_url;
            setImage(submittedData.image_url);
            formFieldValue.start_datetime = submittedData.start_date;
            formFieldValue.end_datetime = submittedData.end_date;
            formFieldValue.level_id = submittedData.data_level_id;
            formFieldValue.event_type = submittedData.event_type;
            formFieldValue.location_ids = submittedData.state_ids.map(obj => obj.id);
            formFieldValue.state_obj = submittedData.state_ids;
        }
        getDataLevels();
        getStates();
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
        formFieldValue.level_id = value.id
    }

    const handleStateChange = (event, value) => {
        formFieldValue.location_ids = value.map(obj => obj.id);
    }


    async function getStates() {
        let states = await fetch("api/event/states", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await states.json();
        setCountryStates(res.data);
    }

    async function CreateEvents() {
        setLoader(true);
        try {
            const formData = new FormData();
            formData.append('start_datetime', formFieldValue.start_datetime);
            formData.append('event_id', formFieldValue.event_id);
            formData.append('event_title', formFieldValue.event_title);
            formData.append('end_datetime', formFieldValue.end_datetime);
            formData.append('level_id', formFieldValue.level_id);
            formData.append('location_ids', formFieldValue.location_ids);
            formData.append('event_type', formFieldValue.event_type);
            formData.append('img', formFieldValue.img);
            const response = await axios.post(
                'api/event/create', formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data;'
                    },
                }
            );
            if (response.data.success) {
                setLoader(false)
                toast.success(response.data.message);
                navigateToHome()
            }
        } catch (error) {
            setLoader(false)
            toast.error(error);
        }
    }

    function setFormField(event, field) {
        if (field === 'start_datetime' || field === 'end_datetime') {
            formFieldValue[field] = event.$d
            setEndDateCal(event.$d)
        } else {
            formFieldValue[field] = event.target.value;
            const newValue = event.target.value;
            setFormFieldValue((prevFormValues) => ({
                ...prevFormValues,
                [field]: newValue,
            }));
        }
    }

    const handleImagesChange = (e) => {
        const file = e.target.files[0];
        formFieldValue.img = file;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setImage(reader.result);
        };
    }

    const setEndDateCal = (date) => {
        setStartDate(dayjs(date));
    };


    const removeImage = () => {
        formFieldValue.img = ''
        setImage('');
    }


    const submit = () => {
        for (let i = 0; i < requiredField.length; i++) {
            const item = formFieldValue[requiredField[i]]
            if (!item) {
                toast.error(`Please enter ${requiredField[i]}`, {
                    position: "top-center",
                    autoClose: false,
                    theme: "colored",
                })
                return
            }
        }
        CreateEvents()
    }

    const fileInputRef = useRef(null);


    const handleImageUploadClick = () => {
        // Trigger the input[type="file"] element when the image is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const navigateToHome = () => {
        navigate(
            {
                pathname: '/',
            },
        );
    }

    return (
        <div>
            {loader ?
                <Loader type="bubble-ping" bgColor={"#FFFFFF"} title="Loading.." color={'#FFFFFF'}
                        size={100}/>
                :
                <></>
            }
            <div className="container mt-5">
                <div className="event-path">
                    <h6>Events /</h6>
                    <h6> Create an Event</h6>
                </div>
                <h3 className="font-weight-300">Create an Event</h3>
                <div className="event-create-form-bg">
                        <TextField id="outlined-basic"
                                   onChange={(event) => setFormField(event, 'event_title')}
                                   label="Event title" variant="outlined" className="w-100"
                                   value={formFieldValue.event_title}
                        />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                            <div className="d-flex justify-content-between">
                                <DateTimePicker
                                    required={true}
                                    label="Start date & Time *"
                                    className="w-49"
                                    value={formFieldValue.start_datetime ? dayjs(formFieldValue.start_datetime) : null}
                                    onChange={(event) => {
                                        setFormField(event, 'start_datetime')
                                        if (formFieldValue.end_datetime) {
                                            if (dayjs(event.$d) > dayjs(formFieldValue.end_datetime)) {
                                                setFormField(event, 'end_datetime')
                                            }
                                        }
                                    }
                                    }
                                />
                                <DateTimePicker
                                    label="End date & Time"
                                    className="w-49"
                                    value={formFieldValue.end_datetime ? dayjs(formFieldValue.end_datetime) : null}
                                    minDateTime={startDate}
                                    onChange={(event) => {
                                        if (formFieldValue.start_datetime && event.$d < formFieldValue.start_datetime) {
                                            alert("End date cannot be earlier than the start date.");
                                            return;
                                        }
                                        setFormField(event, 'end_datetime');
                                    }}
                                />
                            </div>
                        </DemoContainer>
                    </LocalizationProvider>
                    <p className="mt-5">Upload Image/ Banner:</p>
                    <div>
                        <div className="image-container">
                            {image ?
                                <img
                                    onClick={removeImage}
                                    className="close-icon-img"
                                    src={imgCross}
                                    alt="cross-icon"/>
                                :
                                <></>
                            }
                            <img src={image ? image : imgDefault} alt="upload image" className="preview-image"  onClick={handleImageUploadClick}/>
                            <input type="file" className="file-input" onChange={handleImagesChange} ref={fileInputRef} />
                        </div>
                    </div>
                    { isEdit ?
                        <div>
                            <div className="mt-5">
                                <Autocomplete
                                    options={dataLevels}
                                    getOptionLabel={(option) => option.name || ""}
                                    getOptionValue={(option) => option.id || ""}
                                    value={dataLevels.find((option) => option.id === formFieldValue.level_id) || formFieldValue.level_id || null}
                                    className="w-100"
                                    onChange={handleLevelChange}
                                    renderInput={(params) => <TextField {...params} label="Select levels"/>}
                                />
                            </div>
                            <div className="mt-2">
                                <Autocomplete
                                    className="w-100"
                                    multiple
                                    options={countryStates}
                                    getOptionLabel={(option) => option?.name || ""}
                                    getOptionValue={(option) => option?.id || ""}
                                    value={formFieldValue.state_obj}
                                    onChange={handleStateChange}
                                    renderInput={(params) => <TextField {...params} label={`Select State`}/>}
                                />
                            </div>
                        </div>
                        :
                        <div>
                            <div className="mt-5">
                                <Autocomplete
                                    options={dataLevels}
                                    getOptionLabel={(option) => option.name || ""}
                                    getOptionValue={(option) => option.id || ""}
                                    className="w-100"
                                    onChange={handleLevelChange}
                                    renderInput={(params) => <TextField {...params} label="Select levels"/>}
                                />
                            </div>
                            <div className="mt-2">
                                <Autocomplete
                                    className="w-100"
                                    multiple
                                    options={countryStates}
                                    getOptionLabel={(option) => option.name || ""}
                                    getOptionValue={(option) => option.id || ""}
                                    onChange={handleStateChange}
                                    renderInput={(params) => <TextField {...params} label={`Select State`}/>}
                                />
                            </div>
                        </div>
                    }

                    <div className="mt-2">
                        { isEdit ?
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={formFieldValue.event_type}

                            >
                                <FormControlLabel value="open_event"
                                                  onChange={(event) => setFormField(event, 'event_type')}
                                                  control={<Radio/>} label="Open event"/>
                            </RadioGroup>
                            :
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="open_event"
                                                  onChange={(event) => setFormField(event, 'event_type')}
                                                  control={<Radio/>} label="Open event"/>
                            </RadioGroup>
                        }
                    </div>
                    <div>
                    </div>
                </div>
            </div>
            <div className="submit-btn cursor-pointer" onClick={submit}>
                <span>
                Next
                </span>
                <img className="next-btn" src={nextBtn}/>
            </div>
        </div>
    )
}
