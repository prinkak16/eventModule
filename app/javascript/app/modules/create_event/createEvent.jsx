import React, {useEffect, useRef, useState} from 'react';
import './createEvent.scss';
import {
    Autocomplete, Box, Button, createFilterOptions,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel, MenuItem, Modal,
    Radio,
    RadioGroup,
    TextField, Typography
} from "@mui/material";
import dayjs, {Dayjs} from 'dayjs';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import axios from "axios";
import {storage} from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {toast} from 'react-toastify';
import Select from 'react-select'
import makeAnimated from "react-select/animated";
import {useNavigate} from "react-router";


export default function CreateEvent() {
    const navigate = useNavigate()
    const [dataLevels, setDataLevels] = useState([]);
    const [disbledEndDate, setDisbledEndDate] = useState(true)
    const [state, setState] = useState({
        CountryStates:[],
        StateZones:[],
        ParliamentaryConstituency:[],
        Zilas:[],
        AssemblyConstituency:[],
        Mandals:[],
        ShaktiKendras:[],
        Booths:[],
        CountryStateId: '',
        StateZoneId: '',
        ParliamentaryConstituencyId: '',
        ZilaId: '',
        AssemblyConstituencyId: '',
        MandalId: '',
        ShaktiKendraId: '',
        BoothId: '',
    });


    const defaultImageUrl = 'https://firebasestorage.googleapis.com/v0/b/bjp-saral.appspot.com/o/9saalbemisaal_stage2b659a1c-849f-4276-be40-5bc60f5de98592615.png?alt=media&token=285898f6-5a72-4fe2-9bae-883b6b92aa4d'
    let isPradesh = useRef(false);
    const [image, setImage] = useState(defaultImageUrl)
    const [fieldTypes, setFieldTypes] = useState([])
    const [loader, setLoader] = useState()
    const [startDate, setStartDate] = useState()
    const animatedComponents = makeAnimated();
    const order = {
        CountryState: ["State"],
        StateZone : ["State", "Vibhag"],
        ParliamentaryConstituency: ["State", "Lok Sabha"],
        Zila : ["State", "Zila"],
        AssemblyConstituency: ['State', "Vidha Sabha"],
        Mandal : ["State", "Zila", "Mandal"],
        ShaktiKendra : ['State', "Vidha Sabha", "Shakti Kendra"],
        Booth :["State","Vidha Sabha","Booth"]
    };

    const StateKeys = {
        state: "CountryStates",
        vibhag: "StateZones",
        lok_sabha: "ParliamentaryConstituency",
        zila: "Zilas",
        vidha_sabha: "AssemblyConstituency",
        mandal: "Mandals",
        shakti_kendra: "ShaktiKendras",
        booth: "Booths"
    }

    const apiOrder = {
        vibhag: "state_zone",
        lok_sabha: "pc",
        zila: "Zila",
        vidha_sabha: "ac",
        mandal: "mandal",
        shakti_kendra: "sk",
        booth: "booth"
    }

    // Form field values

    const [formFieldValue, setFormFieldValue] = useState({
        start_datetime: '',
        end_datetime: '',
        level_id: '',
        state_id: '',
        location_type: '',
        location_ids: [],
        event_type: '',
        image_url: ''
    });

    const requiredField = ['start_datetime']



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
        for (let i = 0; i < fieldTypes.length; i++) {
            setFieldvalue(fieldTypes[i],'')
        }
        formFieldValue.level_id = value.id
        formFieldValue.location_type = value.name
        setFieldTypes(order[value.level_class])
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
        setState((prevState) => ({
            ...prevState,
            ['CountryStates']: res.data
        }));
    }



    async function getApisValue(fetchType,valueType,value) {
        let levels = await fetch(`api/event/${apiOrder[fetchType]}s?${valueType}_id=${value}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await levels.json();
        setState((prevState) => ({
            ...prevState,
            [`${StateKeys[fetchType]}`]: res.data
        }));
    }

    async function CreateEvents() {
        let levels = await fetch(`api/event/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            },
            body: JSON.stringify(formFieldValue)
        });
        const res = await levels.json();
        if (res.success) {
            // navigateToHome()
        }
    }



    function setFormField(event, field){
        if (field === 'start_datetime' || field === 'end_datetime') {
            formFieldValue[field] = event.$d
            setEndDateCal(event.$d)
        } else {
            formFieldValue[field] = event.target.value;
        }
    }

    const getOptions = (type) => {
        let data = []
        if (type) {
            const transformedType = convertSnackCase(type)
            data = state[StateKeys[transformedType]]
        }
        return data
    }

    const convertSnackCase = (value) => {
        return value.replace(/\s+/g, '_').toLowerCase();
    }
    const chopLastLatter = (value) => {
        return value.substring(0, value.length - 1);
    }

    const handleFieldChange = (fieldType,index) => (event, value) => {
        if (fieldType) {
          setFieldvalue(fieldType,value.id)
            if (fieldTypes.length > index+1) {
                callApis(fieldTypes[index+1],value.id)
            }

            if (value.action === 'select-option' && fieldTypes.length === parseInt(index+1)) {
               const new_option_id = value.option.id
                formFieldValue.location_ids = [...formFieldValue.location_ids, new_option_id];
            }
            if (value.action === 'clear') {
                formFieldValue.location_ids = []
            }
        }
    }

    const setFieldvalue = (fieldType, value) => {
        let transformedType = convertSnackCase(fieldType);
        if (fieldType !== 'lok_sabha' && fieldType  !== 'vidha_sabha') {
            transformedType = chopLastLatter(StateKeys[transformedType]);
        }
        setState((prevState) => ({
            ...prevState,
            [`${transformedType}Id`]: value
        }));
    }


    useEffect(() => {
        if (state['CountryStateId']) {
            formFieldValue.state = state['CountryStateId']
        }

    }, [state['CountryStateId']]);

    const fieldValue = (fieldType) => {
        if (fieldType) {
            const transformedType = convertSnackCase(fieldType);
            const key = StateKeys[transformedType].substring(0, StateKeys[transformedType].length - 1);
            return  state[`${key}Id`]
        }
    }

    const callApis = (fetchType,value) => {
        let transformedType = convertSnackCase(fetchType);
        let valueType = 'state'
        if (transformedType === 'mandal') {
            valueType = apiOrder['zila']
        }
        if (transformedType === 'booth' || transformedType === 'shakti_kendra') {
            valueType = apiOrder['vidha_sabha']
        }

        getApisValue(transformedType,valueType,value)
    }

    const handleImagesChange = (event) => {
        handleFileInputChange(event.target.files[0])

        event.target.value = null;
    }

    async function convertUrl(file) {
        try {
            const form = new FormData();
            form.append("file", file);

            const response = await axios.post(
                upload_url + '/api/v1/custom_member_forms/add_file', form,
                {
                    headers: {
                        'content-type': 'multipart/form-data;'
                    },
                }
            );
            setImage(response.data.data.data)
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    function handleFileInputChange(file) {
        let fileName = file.name
        const fileExtension = fileName.split('.').pop();
        if (!file) return;
        setLoader(true)
        const storageRef = ref(storage, FIREBASE_SUB_DIRECTORY+uuidv4()+`${Math.floor(10000 + Math.random() * 90000)}.${fileExtension}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
            (snapshot) => {},
            (error) => {
                setLoader(false);
                // disablePhotosInput(false, questionid, sectionid)
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    if (downloadURL) {
                       setImage(downloadURL)
                        formFieldValue.image_url = downloadURL
                    }
                });
            }
        );

    }

    const setEndDateCal = (date) => {
        setStartDate(dayjs(date));
        setDisbledEndDate(false)
    };


    const removeImage = () =>  {
        formFieldValue.image_url = ''
        setImage(defaultImageUrl)
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

    const  navigateToHome = () => {
        navigate(
            {
                pathname: '/',
            },
        );
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
                                    required={true}
                                    label="Start date & Time *"
                                    className="w-49"
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
                                    disabled={disbledEndDate}
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
                            <img
                                onClick={removeImage}
                                className="close-icon-img"
                                src={'https://firebasestorage.googleapis.com/v0/b/bjp-saral.appspot.com/o/9saalbemisaal_stagea56e5caf-a095-4905-be45-6057e556d45824903.png?alt=media&token=5fe37d9c-f8a9-4f52-8d5d-383848c84dba'}
                                alt="cross-icon"/>
                            <img src={image} alt="upload image" className="preview-image"/>
                            <input type="file" className="file-input"  onChange={handleImagesChange}/>
                        </div>
                    </div>
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
                    {fieldTypes && fieldTypes.map((field, index) => (
                    <>
                            <div className="mt-2" key={index}>
                                {fieldTypes.length === index + 1 ?
                                    <Select
                                            key={index}
                                            components={animatedComponents}
                                            className="w-100"
                                            options={getOptions(field)}
                                            getOptionLabel={(option) => option.name || ""}
                                            getOptionValue={(option) => option.id || ""}
                                            onChange={handleFieldChange(field, index)}
                                            // renderInput={(params) => <TextField {...params} label={`Select ${field}`}/>}
                                            isMulti={true}
                                    />
                                    :
                                    <Autocomplete
                                        className="w-100"
                                        key={index}
                                        value={getOptions(field).find(value => value.id === parseInt(fieldValue(field))) || null}
                                        options={getOptions(field)}
                                        getOptionLabel={(option) => option.name || ""}
                                        getOptionValue={(option) => option.id || ""}
                                        onChange={handleFieldChange(field, index)}
                                        renderInput={(params) => <TextField {...params} label={`Select ${field}`}/>}
                                    />
                                }
                        </div>
                    </>
                    ))}
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
            <div className="submit-btn" onClick={submit}>
                <span>
                Next
                </span>
                <img className="next-btn" src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAZlBMVEUAAAD////Dw8PFxcXAwMAjIyP09PT39/cbGxu+vr7y8vITExM3NzcgICB7e3u6urqCgoI/Pz/p6emLi4twcHCWlpZERESnp6ff399mZmZeXl6enp4oKCgJCQl9fX1LS0tVVVVtbW2PadDZAAADbUlEQVR4nO2d23KqQBBFZyQKB5Eg4iV6TMz//2QAtYKAl6rQ1XT3Xm9526v2XEAnjvMd8vfVd3J0wjjOk2IdxF0d1/o7PiTcWf/EZhs+NNx9cCccgDS/axim3OEG4jPsN3zjDjYgQZ+hlgLPZF3DL+5MA3NqG8peQftY3hqeuPMQsG8a6pqDV7Jfw3fuLEQEV8OYOwkZ4cVQw4NMP+nZcMedg5C8NtxzxyCkqAxz7hSkzErDFXcIUg6l4ZQ7BCmJd7oHqXOx07rbXwlcxh2BmLU7cUcgpnARdwRitL33dtG9VVSI++AXAAAAAAAAAIBMEu2f5U1DH3BnIOV/9QWeZsXprP6eecKdg4zp9WiS1hYvDeptcdE8XKaxxUaDOltc3ArqU5y2BbUN1KgrqKvFzhDV1uK85zx5jZYzur1DVFOL0b0GtbQ4v9+gjuXmYYMaWly0/59Dn2Lw1FD8QH1B0UCL0jcNtGhkLv7jzvhHMFChKAIoVhhYbrBpjJ6J/hZfUJS+3EDRiKKBuWhAUfpAxVu/hhZfGKjSW8RyY6RFKI4eKGpQxNZfgU1j9EARiiKAohFF6ZsGtv4KvPWPHgNzES0amYsGFA3MRektYuvX0CI2jQoDJzYMDFTpivlzRdm/sqq+QwgaEJS9H6p/plH/XIo5KP39EA0aEFS/yKifg7IbxEYvvUHMQQMNQnDUQBCCI0f92URs9BAcORCUvshAUPr7oPoG1f/0gPonGfVHEbDISBfEx4YGBGUvMuq3CQxR6a9LaBBzcORAEEN05GCbQIMjBw1KX0Vf+F192YIv3I0gXfDp/RayF5kzD1uU32CF+ntmDNwVZOC+JwN3dhm4d83A3XkG7j80cIelgXtIDdwla+A+YAN3Ohu4l9vA3eoAAAAAAAAAAKRw5A5AzNFF3BGIidySOwIxS1dwRyCmcGvuCMSsnZ7vZfuZuJg7AjGx8wl3BlKW3vkDdwhStqWh7mE6Kw39B3cKQgpfGe64YxCS14Y+5c5Bxqc/G4bcQcgIL4Zqv6Stj/PWhkrHaeZ/Df2JOw0Be9809BvuPIOz8beG/os70cDsfdtQ2VzMfNdQ1aGJxj9FNAx9qOV9P22eGmwalg9wGp5R09urFm4NvY8Pst8XN9v2/7S0DUvyt9X3MpL2OepxnhTroOcM/Q+QmSCzD4veRQAAAABJRU5ErkJggg=='}/>
            </div>
        </div>
    )
}
