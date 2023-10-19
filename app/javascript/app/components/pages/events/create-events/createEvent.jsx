import React, { useEffect, useState, useRef } from "react";
import "./createEvent.scss";
import {
  Autocomplete,
  Box,
  Chip,
  FormControlLabel,
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

export default function CreateEvent({ isEdit, editData }) {
  const { id } = useParams();

  const imgDefault =
    "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
  const imgCross =
    "https://storage.googleapis.com/public-saral/public_document/icon.jpg";
  const nextBtn =
    "https://storage.googleapis.com/public-saral/public_document/button.png";
  const navigate = useNavigate();
  const [dataLevels, setDataLevels] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [image, setImage] = useState();
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
    event_id: "",
    state_obj: [],
  });

  const requiredField = ["start_datetime"];

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const { data } = await getEventById(id);
        // if (data?.success) {
        //   formFieldValue.event_id = data?.event?.id;
        //   formFieldValue.event_title = data?.event?.name;
        //   formFieldValue.img = data?.event?.image_url;
        //   setImage(data?.event?.image_url);
        //   formFieldValue.start_datetime = data?.event?.start_date;
        //   formFieldValue.end_datetime = data?.event?.end_date;
        //   formFieldValue.level_id = data?.event?.data_level_id;
        //   formFieldValue.event_type = data?.event?.event_type;
        //   formFieldValue.location_ids = data?.event?.state_ids?.map(
        //     (obj) => obj.id
        //   );
        //   formFieldValue.state_obj = editData.state_ids ?? [];
        // }
        console.log("event by id", data);
      })();
    }
    getAllData();
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

  const getAllData = async () => {
    console.log("get all data is called");
    try {
      const { data } = await getStates();
      if (data?.success) {
        setCountryStates(data?.data ?? []);
      }

      console.log("response by all states", data);
    } catch (error) {
      console.log("error is ", error);
    }

    try {
      const dataLevelResponse = await getDataLevels();
      if (dataLevelResponse?.data?.success) {
        setDataLevels(dataLevelResponse?.data?.data);
      }
      console.log("data levels ", dataLevelResponse);
    } catch (error) {
      console.log("error is ", error);
    }
    // const data = await Promise.allSettled([getStates(), getDataLevels()]);
    // console.log("data of promise all", data);
  };

  async function CreateEvents() {
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("start_datetime", formFieldValue?.start_datetime);
      formData.append("event_id", formFieldValue?.event_id);
      formData.append("event_title", formFieldValue?.event_title);
      formData.append("end_datetime", formFieldValue?.end_datetime);
      formData.append("level_id", formFieldValue?.level_id);
      formData.append("location_ids", formFieldValue?.location_ids);
      formData.append("event_type", formFieldValue?.event_type);
      formData.append("img", formFieldValue?.img);
      // const response = await ApiClient.post("/event/create", formData);

      const response = await createEvent(formData);

      if (response.data.success) {
        setLoader(false);
        toast.success(response.data.message);
        // window.location.href = response.data.event.create_form_url;
        // navigateToHome();
      } else {
        setLoader(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error);
    }
  }

  function setFormField(event, field) {
    if (field === "start_datetime" || field === "end_datetime") {
      formFieldValue[field] = event.$d;
      setEndDateCal(event.$d);
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
  };

  const setEndDateCal = (date) => {
    setStartDate(dayjs(date));
  };

  const removeImage = () => {
    formFieldValue.img = "";
    setImage("");
  };

  const submit = () => {
    for (let i = 0; i < requiredField.length; i++) {
      const item = formFieldValue[requiredField[i]];
      if (!item) {
        toast.error(`Please enter ${requiredField[i]}`, {
          position: "top-center",
          autoClose: false,
          theme: "colored",
        });
        return;
      }
    }
    CreateEvents();
  };

  const fileInputRef = useRef(null);

  const handleImageUploadClick = () => {
    // Trigger the input[type="file"] element when the image is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const navigateToHome = () => {
    navigate({
      pathname: "/",
    });
  };

  // useEffect(() => {
  //   console.log("form value s", formFieldValue);
  // }, [formFieldValue]);

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
      <div className="mt-5 container-adjust">
        <div className="event-path">
          <MyBreadcrumbs />
        </div>
        <h3 className="font-weight-300">
          {isEdit ? "Edit the Event" : "Create an Event"}
        </h3>
        <Box component={Paper} className="event-create-form-bg">
          <TextField
            id="outlined-basic"
            onChange={(event) => setFormField(event, "event_title")}
            label="Event title"
            variant="outlined"
            className="w-100"
            value={formFieldValue.event_title}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex justify-content-between">
              <DateTimePicker
                required={true}
                label="Start date & Time *"
                className="w-49"
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
                label="End date & Time"
                className="w-49"
                value={
                  formFieldValue.end_datetime
                    ? dayjs(formFieldValue.end_datetime)
                    : null
                }
                minDateTime={startDate}
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
            <p>Upload Image/ Banner:</p>
            <div>
              <div className="image-container">
                {image ? (
                  <img
                    onClick={removeImage}
                    className="close-icon-img"
                    src={imgCross}
                    alt="cross-icon"
                  />
                ) : (
                  <></>
                )}
                <img
                  src={image ? image : imgDefault}
                  alt="upload image"
                  className="preview-image"
                  onClick={handleImageUploadClick}
                />
                <input
                  type="file"
                  className="file-input"
                  onChange={handleImagesChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>

          <div className="levels">
            <h6 style={{ display: "flex", alignItems: "center" }}>
              Event Level:
            </h6>
            {Array.isArray(dataLevels) &&
              dataLevels.map((item, index) => (
                <Chip
                  clickable
                  key={index}
                  sx={{
                    height: "40px",
                    width: "120px",
                    background:
                      item?.id === formFieldValue?.level_id ? "#163560" : "",
                    color:
                      item?.id === formFieldValue?.level_id ? "white" : "black",
                  }}
                  label={item?.name}
                  onClick={() =>
                    setFormFieldValue((prevData) => {
                      return { ...prevData, level_id: item?.id };
                    })
                  }
                />
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
              <TextField {...params} label={`Select State`} />
            )}
          />

          <div className="mt-2">
            <h6>Reporting Target*</h6>

            <RadioGroup
              row
              value={formFieldValue?.event_type}
              aria-labelledby="demo-row-radio-buttons-group-label"
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
          <div className="next-btn" onClick={submit}>
            <h4>Next</h4>
            <img className="next-btn" src={nextBtn} />
          </div>
        )}

        {isEdit && (
          <>
            <Chip
              clickable
              label="Save Event"
              variant="outlined"
              sx={{ height: "40px", border: "1px solid black" }}
              onClick={submit}
            />

            <Chip
              className="edit-chip"
              sx={{
                background: "black",
                color: "white",
                height: "40px",
                width: "150px",
              }}
              clickable
              label="Go to form"
              onClick={submit}
            />
          </>
        )}
      </div>
    </div>
  );
}
