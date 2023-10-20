import React, { useEffect, useState } from "react";
import "./form.module.scss";

import { Autocomplete, Box, Pagination, Paper, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArchive, faEye } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { ApiClient } from "../../../services/RestServices/BaseRestServices";
import FormEventCard from "./FormEventCard";
// import { DefaultImage } from "../../../assests/png";
import DefaultImage from "../../../assests/png/defaultimage.png";
const FormComponent = () => {
  const imgDefault =
    "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
  const nextBtn =
    "https://storage.googleapis.com/public-saral/public_document/button.png";
  const navigate = useNavigate();
  const [allEventList, setAllEventList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loader, setLoader] = useState(false);
  const [eventName, setEventName] = useState("");
  const rowsPerPage = 10;

  async function getEventsList() {
    const params = {
      search_query: eventName,
      limit: rowsPerPage,
      offset: rowsPerPage * (page - 1),
    };

    try {
      let { data } = await ApiClient.get("/event/event_user_list", {
        params: params,
      });
      if (data.success) {
        setAllEventList(data.data);
        setTotalCount(data?.total ?? data?.data?.length);
      } else {
        toast.error(`Please enter ${data.message}`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Failed to get event list", { autoClose: 2000 });
    }
  }

  useEffect(() => {
    getEventsList();
  }, [page]);

  // const submit = async (url) => {
  //   // window.location.href = url;
  //   const data = await ApiClient.get("/event/redirect_to_form");
  //   console.log("data is ", data);
  // };

  const tabClickHandler = async (event_id) => {
    console.log("event id ", event_id);
    console.log("submit api fetched");
    const { data } = await ApiClient.get(
      `event_submission/redirect_to_form?event_id=${event_id}`
    );

    console.log("data is ", data);
    // navigate(data?.data?.redirect_url);
    window.location.href = data.data.redirect_url;
    // fetch("/api/event_submission/redirect_to_form?event_id=" + event_id)
    //   .then((res) => res.json())
    //   .then((data) => (window.location.href = data.data.redirect_url));
  };
  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      getEventsList();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [eventName]);

  return (
    <Box className="form-main-container" component={Paper}>
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
      <Box className="form-event-header" component={Paper}>
        <h2>Events</h2>
      </Box>
      <div className="form-event-search">
        <TextField
          className="search-input"
          sx={{ margin: "30px", width: "80%" }}
          placeholder="Search by Event Name"
          variant="outlined"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="form-events-container">
        {allEventList.length > 0 ? (
          <div className="form-list-container">
            {allEventList.map((event, index) => (
              <FormEventCard event={event} key={index} />
            ))}
          </div>
        ) : (
          <div className="no-event-data">No Data Found</div>
        )}
      </div>
      <div className="pagination">
        <Pagination
          count={Math.ceil(totalCount / 10)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </Box>
  );
};

export default FormComponent;
