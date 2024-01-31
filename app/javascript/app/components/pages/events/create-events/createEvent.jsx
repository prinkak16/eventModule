import React, {useEffect, useState} from "react";
import "./createEvent.scss";
import {
    Autocomplete,
    Box,
    Chip,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    Switch,
    TextField,
} from "@mui/material";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {createEvent} from "../../../../services/RestServices/Modules/EventServices/CreateEventServices";
import {getDataLevels, getStates,} from "../../../../services/CommonServices/commonServices";
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import {getEventById} from "../../../../services/RestServices/Modules/EventServices/EventsServices";
import {LanguageIcon, NextIcon} from '../../../../assests/svg/index'
import ImageCroper from "../../../shared/image-croper/ImageCroper";
import ReactLoader from "../../../shared/loader/Loader";
import EventTitleModal from "./modals/EventTitleModal";
import {EventState} from "../../../../EventContext";

export const languages = [{
    lang: "en", name: "English", value: "",
}, {
    lang: "hn", name: "Hindi", value: "",
}, {
    lang: "mr", name: "Marathi", value: "",
}, {
    lang: "te", name: "Telugu", value: "",
}, {
    lang: "kn", name: "Kannada", value: "",
}, {
    lang: "ta", name: "Tamil", value: "",
}, {
    lang: "bn", name: "Bengali", value: "",
}, {
    lang: "or", name: "Odia", value: "",
}, {
    lang: "gu", name: "Gujarati", value: "",
}, {
    lang: "pa", name: "Punjabi", value: "",
}, {
    lang: "ml", name: "Malayalam", value: "",
}, {
    lang: "as", name: "Assamese", value: "",
},];


export default function CreateEvent({isEdit, editData}) {
    const {setSelectedLanguages} = EventState();
    const {id} = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const publishedParamValue = urlParams.get('published');


    const imgCross = "https://storage.googleapis.com/public-saral/public_document/icon.jpg";

    const navigate = useNavigate();
    const [dataLevels, setDataLevels] = useState([]);
    const [countryStates, setCountryStates] = useState([]);
    const [image, setImage] = useState(null);

    const [loader, setLoader] = useState(false);

    const [formFieldValue, setFormFieldValue] = useState({
        selected_languages: ['english'],
        event_title: "",
        start_datetime: "",
        end_datetime: "",
        level_id: "",
        location_ids: [],
        event_type: "",
        img: "",
        crop_data: "",
        state_obj: [],
        parent_id: !isEdit && id ? id : null,     // here !isEdit is used because in case of edit event {id} from useParams() will be id of that current event which we are editing
        has_sub_event: false,
        inherit_from_parent: false,
        status: ""
    });
    const [openLanguageModal, setOpenLanguageModal] = useState(false);
    const [parentEventDetails, setParentEventDetails] = useState({
        start_datetime: null, end_datetime: null, level_id: "", location_ids: [], state_obj: [],

    })

    const requiredField = ["start_datetime"];


    useEffect(() => {
        if (isEdit) {
            (async () => {
                try {
                    const {data} = await getEventById(id);
                    if (data?.success) {
                        setImage(data?.data[0]?.image_url),

                            setFormFieldValue((prevData) => ({
                                ...prevData,
                                event_id: data?.data[0]?.id,
                                event_title: data?.data[0]?.name,
                                img: data?.data[0]?.image_url,
                                start_datetime: data?.data[0]?.start_date,
                                end_datetime: data?.data[0]?.end_date,
                                level_id: data?.data[0]?.data_level_id,
                                event_type: data?.data[0]?.event_type,
                                location_ids: data?.data[0]?.state_ids?.map((obj) => obj.id),
                                state_obj: data?.data[0]?.state_ids ?? [],
                                has_sub_event: data?.data[0]?.has_sub_event,
                                status: data?.data[0]?.status?.name ?? "",
                            }))
                    } else {
                        toast?.error('Faild to get event details')
                    }
                } catch (e) {
                    toast.error(e?.message);
                }

            })();
        }
        if (!isEdit) {
            (async () => {
                try {
                    const {data} = await getEventById(id);
                    if (data?.success) {
                        setParentEventDetails((prevData) => ({
                            ...prevData,
                            start_datetime: data?.data[0]?.start_date,
                            end_datetime: data?.data[0]?.end_date,
                            level_id: data?.data[0]?.data_level_id,
                            location_ids: data?.data[0]?.state_ids?.map((obj) => obj.id),
                            state_obj: data?.data[0]?.state_ids ?? [],
                        }))
                    } else {
                        toast?.error('Failed to get parent event details')
                    }

                } catch (e) {
                    toast.error(e?.message);

                }
            })();

        }


        getAllData();

        return () => {
            setLoader(false)
        }

    }, []);


    const handleLevelChange = (event, value) => {
        setFormFieldValue((prevFormValues) => ({
            ...prevFormValues, level_id: value.id,
        }));
    };

    const handleStateChange = (event, value) => {
        // Extract the selected location IDs from the 'value' array
        const selectedLocationIds = value?.map((location) => location.id);

        setFormFieldValue((prevFormValues) => ({
            ...prevFormValues, location_ids: selectedLocationIds, state_obj: value,
        }));
    };


    const handleImage = (finalImageAfterCropping) => {
        setFormFieldValue((prevData) => ({
            ...prevData,
            img: finalImageAfterCropping[0]?.un_cropped_file,
            crop_data: finalImageAfterCropping[0]?.crop_data
        }))

    }
    const getAllData = async () => {
        try {
            const {data} = await getStates({parent_id: id});
            if (data?.success) {
                setCountryStates(data?.data ?? []);
            }

        } catch (error) {
            console.log("error is ", error);
        }

        try {
            const dataLevelResponse = await getDataLevels();
            if (dataLevelResponse?.data?.success) {
                /*   if (dataLevelResponse?.data?.data?.length > 1 && !isEdit ) {
                       const defaultId = dataLevelResponse?.data?.data[0]?.id;
                       setFormFieldValue((prevData) => ({...prevData, level_id: defaultId}))
                   }*/

                setDataLevels(dataLevelResponse?.data?.data);


            }
        } catch (error) {
            console.log("error is ", error);
        }
        // const data = await Promise.allSettled([getStates(), getDataLevels()]);
        // console.log("data of promise all", data);
    };

    async function CreateEvents(type, id) {
        setLoader(true);
        const formData = new FormData();
        formData.append("start_datetime", formFieldValue?.start_datetime);
        formData.append("event_title", formFieldValue?.event_title);
        formData.append("end_datetime", formFieldValue?.end_datetime);
        formData.append("level_id", formFieldValue?.level_id);
        formData.append("location_ids", formFieldValue?.location_ids);
        formData.append("event_type", formFieldValue?.event_type);
        formData.append("crop_data", formFieldValue?.crop_data ?? "");

        formData.append("img", formFieldValue?.img ?? "");
        formData.append('has_sub_event', formFieldValue?.has_sub_event)
        formData?.append('inherit_from_parent', formFieldValue?.inherit_from_parent);
        if (formFieldValue?.parent_id !== null && formFieldValue?.parent_id !== undefined) {
            formData.append('parent_id', formFieldValue?.parent_id);
        }
        try {
            const response = await createEvent(formData, {event_id: id});
            const eventId = response?.data?.event?.id;
            if (response?.data?.success) {
                setLoader(false);
                if (type === 'create' || type === 'save') {
                    toast.success(`Event ${type}d successfully`);
                    navigate(`/events/${eventId}`);
                } else if (type === 'go_to_form') {
                    window.location.href = response?.data?.event?.create_form_url;
                }
            } else {
                setLoader(false);
                toast.error(response?.data?.message);
            }

        } catch (error) {
            toast.error(error?.message);
        }

        setLoader(false);

    }

    function setFormField(event, field) {

        if (field === "start_datetime" || field === "end_datetime") {
            setFormFieldValue((prevFormValues) => ({
                ...prevFormValues, [field]: event?.$d

            }));
        } else {
            const {value} = event.target;
            setFormFieldValue((prevFormValues) => ({
                ...prevFormValues, [field]: value,
            }));
        }
    }


    const submit = (type, id) => {
        CreateEvents(type, id);
    };


    const switchHandler = (e) => {
        setFormFieldValue((prevData) => ({...prevData, [e?.target?.name]: e?.target?.checked}))

    }

    useEffect(() => {
        console.log("form value s", formFieldValue);
    }, [formFieldValue]);


    useEffect(() => {
        if (isEdit) {
            if (publishedParamValue === "true") {
                (async () => {
                    setLoader(true);
                    try {
                        const {data} = await ApiClient.get(`event/publish/${id}`);
                        if (data?.success) {
                            navigate(`/events/edit/${id}`);
                        }
                    } catch (e) {
                        toast.error(e.message);
                    }
                    setLoader(false);
                })();
            } else if (publishedParamValue === "false") {
                navigate(`/events/edit/${id}`);
            }
        }

    }, []);
    const isNextButtonDisabled = () => {

        for (let key in formFieldValue) {
            if (key === "status") {

            } else if (formFieldValue?.inherit_from_parent && (key === 'start_datetime' || key === 'end_datetime' || key === 'level_id' || key === 'state_obj' || key === "location_ids")) {

            } else if (isEdit && key === "crop_data") {

            } else if (key === 'parent_id' && formFieldValue[key] === null) {

            } else if (key === 'location_ids' || key === 'state_obj') {
                if (formFieldValue[key].length === 0) {
                    return true;
                }
            } else {

                if (formFieldValue[key] === undefined || formFieldValue[key] === null || formFieldValue[key] === "" || !(/\S/.test(formFieldValue[key]))) {
                    return true;
                }

            }
        }
        return false;

    }

    const handleSelectLanguage = (lang) => {
        const value = lang.toLowerCase();
        if (formFieldValue?.selected_languages?.includes(value)) {
            const restSelectedLanguages = formFieldValue?.selected_languages?.filter((language) => language !== value);

            setFormFieldValue((prevData) => ({...prevData, selected_languages: restSelectedLanguages}));

        } else {
            setFormFieldValue((prevData) => ({
                ...prevData, selected_languages: [...formFieldValue?.selected_languages, value]
            }))
        }

    }


    return (<div className="create-event-container">
        <EventTitleModal openLanguageModal={openLanguageModal} setOpenLanguageModal={setOpenLanguageModal}/>
        {loader ? <ReactLoader/> : (<></>)}
        <div className="container-adjust">
            <h3 className="font-weight-300">
                {isEdit ? "Edit the Event" : "Create the Event"}
            </h3>
            <Box className="event-create-form-bg">
                <div className={"language-select-container"}>
                    {languages?.map((language) => <Chip onClick={() => handleSelectLanguage(language?.name)}
                                                        label={language?.name} clickable className={"item"} style={{
                        height: "40px",
                        minWidth: "100px",
                        background: (formFieldValue?.selected_languages?.includes(language?.name.toLowerCase())) ? "#163560" : "",
                        color: (formFieldValue?.selected_languages?.includes(language?.name.toLowerCase())) ? "white" : "black",
                    }}/>)}
                </div>
                {!isEdit && (formFieldValue?.parent_id !== null && formFieldValue?.parent_id !== undefined) &&
                    <FormControlLabel control={<Switch name={"inherit_from_parent"} onChange={switchHandler}/>}
                                      label="Inherit from parent"/>

                }


                <div className={"input-with-language-icon-container"}>
                    <TextField
                        disabled={isEdit && formFieldValue?.status?.toLowerCase() === 'expired'}
                        id="event_title"
                        onChange={(event) => setFormField(event, "event_title")}
                        variant="outlined"
                        className="w-100"
                        placeholder="Enter Event Title in english"
                        value={formFieldValue.event_title}
                        label={<span>
            Event Title{' '}
                            <span style={{color: 'red'}}>*</span>
          </span>}
                    />
                    {formFieldValue?.selected_languages?.filter((item)=>item!=='english')?.length > 0 && <IconButton onClick={() => {
                        //removing english , because event title in english is already filled
                        const arr = formFieldValue?.selected_languages?.filter((lang) => lang !== 'english')
                        setSelectedLanguages(arr)
                        setOpenLanguageModal(true)
                    }} className={"language-button-container"}>
                        <LanguageIcon className={"icon-button"}/>
                    </IconButton>}
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="d-flex justify-content-between">
                        <DateTimePicker
                            disabled={formFieldValue?.inherit_from_parent || (isEdit && formFieldValue?.status?.toLowerCase() === 'expired')}
                            ampm={false}

                            required={true}
                            label={<span>
           Start date & Time{' '}
                                <span style={{color: 'red'}}>*</span>
            </span>}
                            className="w-49"
                            minDateTime={formFieldValue?.parent_id ? dayjs(parentEventDetails?.start_datetime) : dayjs(new Date()).subtract(5, 'minute')}
                            value={formFieldValue?.inherit_from_parent ? dayjs(parentEventDetails?.start_datetime) : formFieldValue.start_datetime ? dayjs(formFieldValue.start_datetime) : null}
                            maxDateTime={parentEventDetails?.end_datetime ? dayjs(parentEventDetails?.end_datetime) : null}
                            onChange={(event) => {
                                setFormField(event, "start_datetime");
                                if (formFieldValue.end_datetime) {
                                    if (dayjs(event.$d) > dayjs(formFieldValue.end_datetime)) {
                                        setFormField(event, "end_datetime");
                                    }
                                }
                            }}
                        />
                        <DateTimePicker
                            ampm={false}

                            disabled={formFieldValue?.start_datetime === "" || formFieldValue?.inherit_from_parent}
                            label={<span>
            End data & Time{' '}<span style={{color: 'red'}}>*</span>
                   </span>}
                            className="w-49"
                            value={formFieldValue?.inherit_from_parent ? dayjs(parentEventDetails?.end_datetime) : formFieldValue.end_datetime ? dayjs(formFieldValue.end_datetime) : null}
                            minDateTime={dayjs(formFieldValue?.start_datetime)}
                            maxDateTime={parentEventDetails?.end_datetime ? dayjs(parentEventDetails?.end_datetime) : null}
                            onChange={(event) => {
                                setFormField(event, "end_datetime");
                            }}
                        />
                    </div>
                </LocalizationProvider>
                <div>
                    <p>Upload Image/ Banner{' '}<span style={{color: "red"}}>*</span> :</p>
                    <ImageCroper handleImage={handleImage} Initial_image={formFieldValue?.img} isEditable={isEdit}
                                 eventStatus={formFieldValue?.status?.toLowerCase()}/>
                </div>

                <div className="levels">
                    <h6 style={{display: "flex", alignItems: "center"}}>
                        Event Level:
                    </h6>
                    {Array.isArray(dataLevels) && dataLevels.map((item, index) => (<button
                        className="level-button"
                        key={index} disabled={isEdit || formFieldValue?.inherit_from_parent}
                        style={{
                            height: "40px",
                            width: "120px",
                            background: ((formFieldValue?.inherit_from_parent && item?.id === parentEventDetails?.level_id) || item?.id === formFieldValue?.level_id) ? "#163560" : "",
                            color: ((formFieldValue?.inherit_from_parent && item?.id === parentEventDetails?.level_id) || item?.id === formFieldValue?.level_id) ? "white" : "black",
                        }}
                        onClick={() => setFormFieldValue((prevData) => {
                            return {...prevData, level_id: item?.id};
                        })}
                    >{item?.name}  </button>))}
                </div>

                <Autocomplete
                    disabled={isEdit || formFieldValue?.inherit_from_parent}
                    className="w-100"
                    multiple
                    value={formFieldValue?.inherit_from_parent ? parentEventDetails?.state_obj : formFieldValue?.state_obj}
                    options={countryStates}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={handleStateChange}
                    renderInput={(params) => (<TextField {...params} label={<span>
            Select States{' '}
                        <span style={{color: 'red'}}>*</span>
          </span>}/>)}
                />

                <div className="mt-2">
                    <h6>Allow to create sub-events{' '} <span style={{color: "red"}}>*</span></h6>

                    <RadioGroup
                        disabled={isEdit}
                        className="custom-radio-group"
                        row
                        value={formFieldValue?.has_sub_event === true ? 'yes' : 'no'}
                        name="row-radio-buttons-group"
                        onChange={(event) => {
                            setFormFieldValue((prevData) => {
                                return {...prevData, has_sub_event: event.target.value === 'yes' ? true : false};
                            })
                        }}
                    >
                        <FormControlLabel
                            disabled={isEdit}
                            value='yes'
                            control={<Radio/>}
                            label="Yes"

                        />
                        <FormControlLabel
                            disabled={isEdit}
                            value="no"
                            control={<Radio/>}
                            label="No"

                        />
                    </RadioGroup>
                </div>

                <div className="mt-2">
                    <h6>Reporting Target{' '} <span style={{color: "red"}}>*</span></h6>

                    <RadioGroup

                        className="custom-radio-group"
                        row
                        value={formFieldValue?.event_type}
                        name="row-radio-buttons-group"
                        onChange={(event) => setFormFieldValue((prevData) => {
                            return {...prevData, event_type: event.target.value};
                        })}
                    >
                        <FormControlLabel
                            disabled={isEdit}
                            value="open_event"
                            control={<Radio/>}
                            label="Open event"

                        />
                    </RadioGroup>
                </div>
            </Box>
        </div>

        <div className="submit-btn cursor-pointer">
            {!isEdit && (
                <button disabled={isNextButtonDisabled()} className="next-btn" onClick={() => submit('create')}>
                    <h4>Next</h4>
                    <button disabled={isNextButtonDisabled()} className="next-button-container"><NextIcon
                        className="next-button-icon"/></button>
                </button>)}

            {isEdit && (<>
                <button
                    disabled={isNextButtonDisabled()}
                    className="save-button"
                    variant="outlined"
                    style={{height: "40px", border: "1px solid black"}}
                    onClick={() => submit('save', id)}
                > Save Event
                </button>
                {(!formFieldValue?.has_sub_event && formFieldValue?.status?.toLowerCase() !== 'expired') && <button
                    disabled={isNextButtonDisabled()}
                    className="go-to-form-button"
                    style={{
                        background: "black", color: "white", height: "40px", width: "150px",
                    }}

                    onClick={() => submit('go_to_form', id)}
                > Go to form
                </button>}
            </>)}
        </div>
    </div>);
}

