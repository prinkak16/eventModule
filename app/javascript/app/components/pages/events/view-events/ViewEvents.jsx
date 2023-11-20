import React, {useState} from 'react';
import {useEffect} from "react";
import {useParams} from "react-router";
import './view-event.scss'
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import MyBreadcrumbs from "../../../shared/breadcrumbs/Breadcrumbs";
import {Autocomplete, Box, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import ImageCroper from "../../../shared/image-croper/ImageCroper";
import {getDataLevels, getStates} from "../../../../services/CommonServices/commonServices";

const ViewEvents=({isEdit=true})=>{
    const {id}=useParams();
    const [iframeUrl,setIframeUrl]=useState("")
    const [formFieldValue, setFormFieldValue] = useState({
        event_title: "",
        start_datetime: "",
        end_datetime: "",
        level_id: 1,
        location_ids: [],
        event_type: "",
        img: "",
        state_obj: [],
    });
    const [dataLevels, setDataLevels] = useState([]);
    const [countryStates, setCountryStates] = useState([]);


  /*  const getAllData = async () => {
        try {
            const { data } = await getStates();
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
    };*/

    useEffect(() => {
        (async ()=>{
            const {data}= await ApiClient.get(`/event/edit/${id}`) ;

            if (data?.success) {
                setIframeUrl(data?.data[0]?.create_form_url);


                    setFormFieldValue((prevData)=>({
                        ...prevData,
                        event_id: data?.data[0]?.id,
                        event_title: data?.data[0]?.name,
                        img : data?.data[0]?.image_url,
                        start_datetime : data?.data[0]?.start_date,
                        end_datetime : data?.data[0]?.end_date,
                        level_id : data?.data[0]?.data_level_id,
                        event_type : data?.data[0]?.event_type,
                        location_ids : data?.data[0]?.state_ids?.map(
                            (obj) => obj.id
                        ),
                        state_obj : data?.data[0]?.state_ids ?? []
                    }) )
            }   
            

        })();

/*
        getAllData() 
*/
    }, []);

    useEffect(() => {
        console.log('form field value in view  ',formFieldValue)
    }, [formFieldValue]);
    return(
        <div className="view-event-container">
            <div className="container-adjust" style={{width:"48%"}}>
                <div className="event-path">
                    <MyBreadcrumbs />
                </div>

                <Box  className="event-create-form-bg" style={{background:"#f6f8fa"}}>
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
                        <ImageCroper handleImage={()=>{}}/>
                    </div>

                    <div className="levels">
                        <h6 style={{ display: "flex", alignItems: "center" }}>
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
                            <TextField {...params} label={`Select State*`} />
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
                                control={<Radio />}
                                label="Open event"
                            />
                        </RadioGroup>
                    </div>
                </Box>
            </div>

            <div className={"iframe-container"}>
                <iframe src={`${iframeUrl}&np=1`} height="100%" width="100%" title="Iframe Example"></iframe>

            </div>
        </div>

    )
}

export default ViewEvents;