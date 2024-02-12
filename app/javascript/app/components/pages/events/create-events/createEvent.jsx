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
    Tooltip,
} from "@mui/material";
import {styled} from '@mui/material/styles';
import dayjs from "dayjs";
import InfoIcon from '@mui/icons-material/Info';
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {createEvent} from "../../../../services/RestServices/Modules/EventServices/CreateEventServices";
import {getAllLanguages, getDataLevels, getStates,} from "../../../../services/CommonServices/commonServices";
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import {getEventById} from "../../../../services/RestServices/Modules/EventServices/EventsServices";
import {LanguageIcon, LocationIconInfo, NextIcon} from '../../../../assests/svg/index'
import ImageCroper from "../../../shared/image-croper/ImageCroper";
import ReactLoader from "../../../shared/loader/Loader";
import EventTitleModal from "./modals/EventTitleModal";
import {tooltipClasses} from '@mui/material/Tooltip';
import ReactDateTimePicker from '../../../date-time-picker'

const HtmlTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export default function CreateEvent({isEdit, editData}) {
    const {id} = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const publishedParamValue = urlParams.get('published');
    const navigate = useNavigate();
    const [dataLevels, setDataLevels] = useState([]);
    const [countryStates, setCountryStates] = useState([]);
    const [image, setImage] = useState(null);

    const [loader, setLoader] = useState(false);
    const [allLanguages, setAllLanguages] = useState([]);

    const [formFieldValue, setFormFieldValue] = useState({
        selected_languages: ['en'],
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
        status: "",
        translated_title: {}
    });
    const [openLanguageModal, setOpenLanguageModal] = useState(false);
    const [parentEventDetails, setParentEventDetails] = useState({
        start_datetime: null, end_datetime: null, level_id: "", location_ids: [], state_obj: [],

    })
    const [childEventsIntersection, setChildEventIntersection] = useState({
        start_datetime: null, end_datetime: null
    })
    const getParentDetails = async (parent_id) => {
        try {
            const {data} = await getEventById(parent_id);
            if (data?.success) {
                const newObj = {
                    start_datetime: data?.data[0]?.start_date,
                    end_datetime: data?.data[0]?.end_date,
                    level_id: data?.data[0]?.data_level_id,
                    location_ids: data?.data[0]?.state_ids?.map((obj) => obj.id),
                    state_obj: data?.data[0]?.state_ids ?? [],
                }
                setParentEventDetails((prevData) => ({
                    ...prevData,
                    ...newObj
                }))
            } else {
                toast?.error('Failed to get parent event details')
            }

        } catch (e) {
            toast.error(e?.message);

        }
    }


    const formFieldUpdationByEdit = async () => {
        try {
            const {data} = await getEventById(id);
            if (data?.success) {
                setImage(data?.data[0]?.image_url);

                //taking parent_id from current event if exists
                const parent_id = data?.data[0]?.parent_id;
                // fetching parent event details to provide start_date and end_date validation
                if (parent_id) {
                    getParentDetails(parent_id);
                }

                const alreadySelectedLanguages = Object.keys(JSON.parse(data?.data?.[0]?.translated_title) ?? {});

                const newObj = {
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
                    selected_languages: [...formFieldValue?.selected_languages, ...alreadySelectedLanguages],
                    translated_title: JSON.parse(data?.data[0]?.translated_title) ?? {}
                }

                setFormFieldValue((prevData) => ({
                    ...prevData,
                    ...newObj
                }))
                // setting start_date_time and end_date_time from intersection of all child event
                setChildEventIntersection((prevData) => ({
                    ...prevData,
                    start_datetime: data?.start_datetime,
                    end_datetime: data?.end_datetime
                }))

            } else {
                toast?.error('Failed to get event details')
            }
        } catch (e) {
            toast.error(e?.message);
        }


    }

    useEffect(() => {
        if (isEdit) {
            formFieldUpdationByEdit();
        }
        if (!isEdit && id) {
            getParentDetails(id);
        }
        getAllData();
        getLanguages();
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

    const getLanguages = async () => {
        try {
            const {data} = await getAllLanguages();
            setAllLanguages(data?.data);
        } catch (e) {
            console.log(e?.message);
        }
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
        formData?.append('translated_title', JSON.stringify(formFieldValue?.translated_title));
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
        if(e?.target?.checked){
            setFormFieldValue((prevData) => ({...prevData,...parentEventDetails, [e?.target?.name]: e?.target?.checked}))
        }else{
            //to reset all those properties of formFieldValue which we have set when when Inherit from parent switch was turned on

            const newObj={
                start_datetime:null,
                end_datetime:null,
                level_id: "",
                location_ids: [],
                state_obj: [],
            }
            setFormFieldValue((prevData) => ({...prevData,...newObj, [e?.target?.name]: e?.target?.checked}))

        }
    }
    //
    // useEffect(() => {
    //     console.log("form value s", formFieldValue);
    // }, [formFieldValue]);


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

            } else if (key === 'translated_title') {
                // check if input translated_title length is equal to selected_languages length
                //if there are equal it means all respective event name is filled

                // if length are equal , we will return false, so that save button can be enabled
                return Object.values(formFieldValue?.translated_title).filter(item => Boolean(item)).length !== formFieldValue?.selected_languages?.filter(item => item !== 'en')?.length;
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

    const handleSelectLanguage = (language) => {
        const containsIncomingLanguage = formFieldValue?.selected_languages?.some((item) => item === language?.lang);
        if (containsIncomingLanguage) {
            const restSelectedLanguages = formFieldValue?.selected_languages?.filter((item) => item !== language?.lang);
            const modifiedTranslatedTitle = {...formFieldValue?.translated_title};
            //when we unselect a language chip, we will remove its corresponding key-value pair of event-name from translated_title
            delete modifiedTranslatedTitle[language?.lang];
            setFormFieldValue((prevData) => ({
                ...prevData,
                selected_languages: restSelectedLanguages,
                translated_title: modifiedTranslatedTitle
            }));

        } else {
            setFormFieldValue((prevData) => ({
                ...prevData, selected_languages: [...formFieldValue?.selected_languages, language?.lang]
            }))
        }

    }


    const startDateTimeValidation = (validationFor) => {
        if (validationFor === 'minDate') {
            //min date should not be less than that of its parent event
            return parentEventDetails?.start_datetime ? dayjs(parentEventDetails?.start_datetime) : dayjs(new Date()).subtract(5, 'minute')
        } else {
            if (isEdit && childEventsIntersection?.start_datetime) {
                // in case of edit , max-date selection for start-date-time  should not be greater than start-date-time of child-event
                return dayjs(childEventsIntersection?.start_datetime);
            }
            //if not the case of edit, max-date selection should not be greater than the parent end-date-time
            return parentEventDetails?.end_datetime ? dayjs(parentEventDetails?.end_datetime) : null
        }

    }

    const endDateTimeValidation = (validationFor) => {
        if (validationFor === 'minDate') {
            // if start-date-time is selected then that should be the lower bound for end-date-time selection , otherwise lower-bound for end-date-time will depend on end-date-time of child-event , there is no child event, then lower-bound will the start-date-time of parent-event
            return childEventsIntersection?.end_datetime ? dayjs(childEventsIntersection?.end_datetime):
                (formFieldValue?.start_datetime ? dayjs(formFieldValue?.start_datetime) :
                    (parentEventDetails?.start_datetime ? dayjs(parentEventDetails?.start_datetime) : null));
        } else {
            //for upper-bound of end-date-time selection , parent-event end-date-time will be the upper bound
            return parentEventDetails?.end_datetime ? dayjs(parentEventDetails?.end_datetime) : null
        }

    }

    const handleInputChange = (event) => {
        // Prevent changes to the input field programmatically
        event.preventDefault();
    };

    // console.log('start date time is ',startDateTimeValidation('minDate'), startDateTimeValidation(), 'end date time validation i s',endDateTimeValidation('minDate'), endDateTimeValidation())
    return (<div className="create-event-container">
        <EventTitleModal allLanguages={allLanguages} setFormFieldValue={setFormFieldValue}
                         openLanguageModal={openLanguageModal} setOpenLanguageModal={setOpenLanguageModal}
                         translated_title={formFieldValue?.translated_title}
                         languagesMap={formFieldValue?.selected_languages?.filter((language) => language !== 'en')}/>
        {loader ? <ReactLoader/> : (<></>)}
        <div className="container-adjust">
            <h3 className="font-weight-300">
                {isEdit ? "Edit the Event" : "Create the Event"}
            </h3>
            <Box className="event-create-form-bg">
                <div className={"language-select-container"}>
                    {allLanguages?.map((language) => <Chip onClick={() => handleSelectLanguage(language)}
                                                           label={language?.name} clickable className={"item"} style={{
                        height: "40px",
                        minWidth: "100px",
                        background: (formFieldValue?.selected_languages?.some((item) => item === language?.lang)) ? "#163560" : "",
                        color: (formFieldValue?.selected_languages?.some((item) => item === language?.lang)) ? "white" : "black",
                    }}/>)}
                    {
                        formFieldValue?.selected_languages?.filter((item) => item !== 'en')?.length > 0 && <HtmlTooltip
                            title={
                                <React.Fragment>
                                    <LocationIconInfo/>
                                </React.Fragment>
                            }
                        >
                            <IconButton>
                                <InfoIcon className={"info-icon"}/>
                            </IconButton>
                        </HtmlTooltip>


                    }

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
                    {formFieldValue?.selected_languages?.filter((item) => item !== 'en')?.length > 0 &&
                        <IconButton onClick={() => {
                            //removing english , because event title in english is already filled

                            setOpenLanguageModal(true)
                        }} className={"language-button-container"}>
                            <LanguageIcon className={"icon-button"}/>
                        </IconButton>}
                </div>

                    <div className={"date-time-picker-container"}>
                        <ReactDateTimePicker
                            disabled={formFieldValue?.inherit_from_parent || (isEdit && formFieldValue?.status?.toLowerCase() === 'expired')}
                            ampm={false}
                            required={true}
                            title={"Start date & Time"}
                            className="w-49"
                            minDateTime={startDateTimeValidation('minDate')}
                            value={formFieldValue?.inherit_from_parent ? dayjs(parentEventDetails?.start_datetime) : formFieldValue.start_datetime ? dayjs(formFieldValue.start_datetime) : null}
                            maxDateTime={startDateTimeValidation('maxDate')}
                            onChange={(event) => {
                                setFormField(event, "start_datetime");
                                if (formFieldValue.end_datetime) {
                                    if (dayjs(event.$d) > dayjs(formFieldValue.end_datetime)) {
                                        setFormField(event, "end_datetime");
                                    }
                                }
                            }}
                        />

                        <ReactDateTimePicker
                            ampm={false}
                            disabled={formFieldValue?.inherit_from_parent}
                            title={" End data & Time"}
                            required={true}
                            className="w-49"
                            value={formFieldValue?.inherit_from_parent ? dayjs(parentEventDetails?.end_datetime) : formFieldValue.end_datetime ? dayjs(formFieldValue.end_datetime) : null}
                            minDateTime={endDateTimeValidation('minDate')}
                            maxDateTime={endDateTimeValidation('maxDate')}
                            onChange={(event) => {
                                setFormField(event, "end_datetime");
                            }}
                        />
                    </div>
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
                        key={index}
                        disabled={isEdit || formFieldValue?.inherit_from_parent}
                        style={{
                            height: "40px",
                            width: "120px",
                            background: (item?.id === formFieldValue?.level_id) ? "#163560" : "",
                            color: (item?.id === formFieldValue?.level_id) ? "white" : "black",
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

