import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import './view-event.scss'
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import {Autocomplete, Box, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import {getDataLevels, getStates} from "../../../../services/CommonServices/commonServices";
import {toast} from "react-toastify";
import ReactLoader from "../../../shared/loader/Loader";

const ViewEvents = ({isEdit = true}) => {
    const {id} = useParams();
    const [iframeUrl, setIframeUrl] = useState("")
    const [formFieldValue, setFormFieldValue] = useState({
        event_title: "",
        start_datetime: "",
        end_datetime: "",
        level_id: 1,
        location_ids: [],
        event_type: "",
        img: "",
        state_obj: [],
        has_sub_event: false
    });
    const [dataLevels, setDataLevels] = useState([]);
    const [countryStates, setCountryStates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const getAllData = async () => {
        try {
            const {data} = await getStates();
            if (data?.success) {
                setCountryStates(data?.data ?? []);
            }

        } catch (error) {
            console.log("error is ", error);
        }

        try {
            const dataLevelResponse = await getDataLevels();
            if (dataLevelResponse?.data?.success) {
                setDataLevels(dataLevelResponse?.data?.data);
            }
        } catch (error) {
            console.log("error is ", error);
        }
        // const data = await Promise.allSettled([getStates(), getDataLevels()]);
        // console.log("data of promise all", data);
    };


    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {


                const {data} = await ApiClient.get(`/event/edit/${id}`);

                if (data?.success) {
                    setIframeUrl(data?.data[0]?.preview_url);


                    setFormFieldValue((prevData) => ({
                        ...prevData,
                        event_id: data?.data[0]?.id,
                        event_title: data?.data[0]?.name,
                        img: data?.data[0]?.image_url,
                        start_datetime: data?.data[0]?.start_date,
                        end_datetime: data?.data[0]?.end_date,
                        level_id: data?.data[0]?.data_level_id,
                        event_type: data?.data[0]?.event_type,
                        location_ids: data?.data[0]?.state_ids?.map(
                            (obj) => obj.id
                        ),
                        state_obj: data?.data[0]?.state_ids ?? [],
                        has_sub_event: data?.data[0]?.has_sub_event
                    }))
                } else {
                    toast.error('Failed to load the data')
                }
            } catch (e) {
                toast.error(e.message)

            }


            setIsLoading(false)

        })();

        getAllData()
    }, []);


    return (
        <div className="view-event-container">

            {isLoading ? <ReactLoader/> : <div className="form-and-iframe-container">


                <Box className="event-create-form-bg">
                    <TextField
                        disabled
                        id="event_title"
                        label="Event title*"
                        variant="outlined"
                        className="w-100"
                        placeholder="Enter Event Title"
                        value={formFieldValue.event_title}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="d-flex justify-content-between">
                            <DateTimePicker
                                disabled
                                required={true}
                                label="Start date & Time*"
                                className="w-49"
                                minDateTime={dayjs(new Date())}
                                value={
                                    formFieldValue.start_datetime
                                        ? dayjs(formFieldValue.start_datetime)
                                        : null
                                }

                            />
                            <DateTimePicker

                                disabled
                                label="End date & Time*"
                                className="w-49"
                                value={
                                    formFieldValue.end_datetime
                                        ? dayjs(formFieldValue.end_datetime)
                                        : null
                                }
                                minDateTime={dayjs(formFieldValue?.start_datetime)}

                            />
                        </div>
                    </LocalizationProvider>
                    <div>
                        <p>Upload Image/ Banner*:</p>
                        <div className={"img-container"}>
                            <img loading={"lazy"} src={formFieldValue?.img} alt={"Loading..."} className={"img-box"}/>

                        </div>
                    </div>

                    <div className="levels">
                        <h6 style={{display: "flex", alignItems: "center"}}>
                            Event Level:
                        </h6>
                        {Array.isArray(dataLevels) &&
                            dataLevels.map((item, index) => (
                                <button

                                    className="level-button"
                                    key={index}
                                    disabled={true}
                                    style={{
                                        height: "40px",
                                        width: "120px",
                                        background:
                                            item?.id === formFieldValue?.level_id ? "#163560" : "",
                                        color:
                                            item?.id === formFieldValue?.level_id ? "white" : "black",
                                    }}

                                >{item?.name}  </button>
                            ))}
                    </div>

                    <Autocomplete
                        disabled
                        className="w-100"
                        multiple
                        value={formFieldValue?.state_obj}
                        options={countryStates}
                        getOptionLabel={(option) => option.name || ""}
                        renderInput={(params) => (
                            <TextField {...params} label={`Select State*`}/>
                        )}
                    />

                    <div className="mt-2">
                        <h6>Reporting Target*</h6>

                        <RadioGroup

                            className="custom-radio-group"
                            row
                            value={formFieldValue?.event_type}
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"

                        >
                            <FormControlLabel
                                value="open_event"
                                control={<Radio/>}
                                label="Open event"
                            />
                        </RadioGroup>
                    </div>
                </Box>
                {!formFieldValue?.has_sub_event &&
                    <div className={"iframe-container"}>
                        <iframe src={iframeUrl} height="100%" width="100%" title="Iframe Example"/>
                    </div>
                }
            </div>
            }


        </div>

    )
}

export default ViewEvents;