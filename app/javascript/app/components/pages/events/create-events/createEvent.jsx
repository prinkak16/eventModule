import React, { useEffect, useState, useRef } from "react";
import "./createEvent.scss";
import {
  Autocomplete,
  Box,
  Chip, FormControl,
  FormControlLabel, InputLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import Loader from "react-js-loader";
import MyBreadcrumbs from "../../../shared/breadcrumbs/Breadcrumbs";
import { createEvent } from "../../../../services/RestServices/Modules/EventServices/CreateEventServices";
import {
  getDataLevels,
  getStates,
} from "../../../../services/CommonServices/commonServices";
import { ApiClient } from "../../../../services/RestServices/BaseRestServices";
import { getEventById } from "../../../../services/RestServices/Modules/EventServices/EventsServices";
import {UploadIcon, CrossIcon, NextIcon} from '../../../../assests/svg/index'
import ImageCroper from "../../../shared/image-croper/ImageCroper";
export default function CreateEvent({ isEdit, editData }) {
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const publishedParamValue = urlParams.get('published');


  const imgCross =
    "https://storage.googleapis.com/public-saral/public_document/icon.jpg";

  const navigate = useNavigate();
  const [dataLevels, setDataLevels] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState();

  const [loader, setLoader] = useState(false);

  const [formFieldValue, setFormFieldValue] = useState({
    event_title: "",
    start_datetime: "",
    end_datetime: "",
    level_id: 1,
    location_ids: [],
    event_type: "",
    img: "",
    crop_data:"",
    state_obj: [],
  });

  const requiredField = ["start_datetime"];

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const { data } = await getEventById(id);
         if (data?.success) {
           setImage(data?.data[0]?.image_url),

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
    }
    getAllData();

    return ()=>{
      setLoader(false)
    }

  }, []);


  const handleLevelChange = (event, value) => {
    setFormFieldValue((prevFormValues) => ({
      ...prevFormValues,
      level_id: value.id,
    }));
  };

  const handleStateChange = (event, value) => {
    // Extract the selected location IDs from the 'value' array
    const selectedLocationIds = value?.map((location) => location.id);

    setFormFieldValue((prevFormValues) => ({
      ...prevFormValues,
      location_ids: selectedLocationIds,
      state_obj: value,
    }));
  };


  const handleImage=(finalImageAfterCropping)=>{
/*
    console.log('final image afeter cropping ',finalImageAfterCropping);
*/
    setFormFieldValue((prevData)=>({...prevData,img:finalImageAfterCropping[0]?.un_cropped_file,crop_data: finalImageAfterCropping[0]?.crop_data}))
    
  }
  const getAllData = async () => {
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
  };

  async function CreateEvents(type,id) {
    setLoader(true);
    const formData = new FormData();
    formData.append("start_datetime", formFieldValue?.start_datetime);
    formData.append("event_title", formFieldValue?.event_title);
    formData.append("end_datetime", formFieldValue?.end_datetime);
    formData.append("level_id", formFieldValue?.level_id);
    formData.append("location_ids", formFieldValue?.location_ids);
    formData.append("event_type", formFieldValue?.event_type);
    formData.append("crop_data", formFieldValue?.crop_data??"");

    formData.append("img", formFieldValue?.img??"");
    try {
        const response = await createEvent(formData,{event_id:id});
      if (response.data.success) {
        setLoader(false);
      if(type==='go_to_form'||type==='create') {
          window.location.href = response.data.event.create_form_url;
      }else{

        toast.success(response.data.message);
        navigate('/events')
      }
      } else {
        setLoader(false);

        toast.error(response.data.message);
      }

    } catch (error) {

      toast.error(error);

    }

    setLoader(false);

  }

  function  setFormField(event, field) {
    if (field === "start_datetime" || field === "end_datetime") {
      setFormFieldValue((prevFormValues) => ({
        ...prevFormValues,
        [field]: event?.$d,
      }));
    } else {
      const {value} = event.target;
      setFormFieldValue((prevFormValues) => ({
        ...prevFormValues,
        [field]: value,
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
  };

  const setEndDateCal = (date) => {
    setStartDate(dayjs(date));
  };

  const removeImage = () => {
    setFormFieldValue((prevData)=> {
      return {...prevData, img: ""}
    })
    setImage("");
  };

  const submit = (type,id) => {
    for (let i = 0; i < requiredField.length; i++) {
      const item = formFieldValue[requiredField[i]];
      if (!item) {
        toast.error(`Please enter ${requiredField[i]}`, {
          autoClose: 2000,
        });
        return;
      }
    }
    CreateEvents(type,id);
  };

  const fileInputRef = useRef(null);

  const handleImageUploadClick = () => {
    // Trigger the input[type="file"] element when the image is clicked
    if (fileInputRef.current) {
      fileInputRef.current.value=''
      fileInputRef.current.click();
    }
  };

  

   useEffect(() => {
    console.log("form value s", formFieldValue);
  }, [formFieldValue]);


  useEffect(() => {
    if(isEdit){
      if(publishedParamValue==="true"){
        (async ()=>{
          setLoader(true);
          try {
            const {data}=await ApiClient.get(`event/publish/${id}`);
            if(data?.success){
              navigate(`/events/edit/${id}`);
            }
          } catch (e){
            toast.error(e.message);
          }
          setLoader(false);
        })();
      }else if(publishedParamValue==="false"){
        navigate(`/events/edit/${id}`);
      }
    }

  }, []);
  const isNextButtonDisabled=()=>{
    for(let key in formFieldValue){
      if(key==='location_ids'||key==='state_obj'){
        if(formFieldValue[key].length===0) {
          return true;
        }
      }  else{

        if(formFieldValue[key]===""||!(/\S/.test(formFieldValue[key])))  {
          return true;
        }
        
      }
    }
    return false;

  }

  return (
    <div className="create-event-container">
      {loader ? (
        <Loader
          type="bubble-ping"
          bgColor={"#FFFFFF"}
          title="Loading.."
          color={"#FFFFFF"}
          size={100}
        />
      ) : (
        <></>
      )}
      <div className="container-adjust">
        <div className="event-path">
          <MyBreadcrumbs />
        </div>
        <h3 className="font-weight-300">
          {isEdit ? "Edit the Event" : "Create an Event"}
        </h3>
        <Box  className="event-create-form-bg">
          
          <TextField
            id="event_title"
            onChange={(event) => setFormField(event, "event_title")}
            variant="outlined"
            className="w-100"
            placeholder="Enter Event Title"
            value={formFieldValue.event_title}
            label={
              <span>
            Event Title{' '}
                <span style={{ color: 'red' }}>*</span>
          </span>
            }
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between">
              <DateTimePicker
                required={true}
                label={
                  <span>
           Start date & Time{' '}
                    <span style={{ color: 'red' }}>*</span>
          </span>
                }
                className="w-49"
                minDateTime={dayjs(new Date())}
                value={
                  formFieldValue.start_datetime
                    ? dayjs(formFieldValue.start_datetime)
                    : null
                }
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
                  disabled={formFieldValue?.start_datetime===""}
                  label={
                    <span>
            End data & Time{' '}
                      <span style={{ color: 'red' }}>*</span>
          </span>
                  }
                className="w-49"
                value={
                  formFieldValue.end_datetime
                    ? dayjs(formFieldValue.end_datetime)
                    : null
                }
                minDateTime={dayjs(formFieldValue?.start_datetime)}
                onChange={(event) => {
                  if (
                    formFieldValue.start_datetime &&
                    event.$d < formFieldValue.start_datetime
                  ) {
                    alert("End date cannot be earlier than the start date.");
                    return;
                  }
                  setFormField(event, "end_datetime");
                }}
              />
            </div>
          </LocalizationProvider>
          <div>
          <p>Upload Image/ Banner{' '}<span style={{color:"red"}}>*</span> :</p>
             <ImageCroper handleImage={handleImage} Initial_image={formFieldValue?.img} isEditable={isEdit} />
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
                    disabled={isEdit}
                  style={{
                    height: "40px",
                    width: "120px",
                    background:
                      item?.id === formFieldValue?.level_id ? "#163560" : "",
                    color:
                      item?.id === formFieldValue?.level_id ? "white" : "black",
                  }}
                  onClick={() =>
                    setFormFieldValue((prevData) => {
                      return { ...prevData, level_id: item?.id };
                    })
                  }
                >{item?.name}  </button>
              ))}
          </div>

          <Autocomplete
            className="w-100"
            multiple
            value={formFieldValue?.state_obj}
            options={countryStates}
            getOptionLabel={(option) => option.name || ""}
            onChange={handleStateChange}
            renderInput={(params) => (
              <TextField {...params} label={
                <span>
            Select States{' '}
                  <span style={{ color: 'red' }}>*</span>
          </span>
              } />
            )}
          />

          <div className="mt-2">
            <h6>Reporting Target{' '} <span style={{color:"red"}}>*</span> </h6>

            <RadioGroup
               className="custom-radio-group"
              row
              value={formFieldValue?.event_type}
              name="row-radio-buttons-group"
              onChange={(event) =>
                setFormFieldValue((prevData) => {
                  return { ...prevData, event_type: event.target.value };
                })
              }
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

      <div className="submit-btn cursor-pointer">
        {!isEdit && (
          <button  disabled={isNextButtonDisabled()} className="next-btn" onClick={()=>submit('create')} >
            <h4>Next</h4>
            <button disabled={isNextButtonDisabled()}  className="next-button-container"><NextIcon className="next-button-icon" /> </button>
          </button>
        )}

        {isEdit && (
          <>
            <button
                disabled={isNextButtonDisabled()}
                className="save-button"
              variant="outlined"
              style={{ height: "40px", border: "1px solid black" }}
              onClick={()=>submit('save',id)}
            > Save Event  </button>

            <button
                disabled={isNextButtonDisabled()}
                className="go-to-form-button"
                style= {{
                background: "black",
                color: "white",
                height: "40px",
                width: "150px",
              }}
              
              onClick={()=>submit('go_to_form',id)}
            >               Go to form
            </button>
          </>
        )}
      </div>
    </div>
  );
}

