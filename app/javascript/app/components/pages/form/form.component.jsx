import React, { useEffect, useState } from "react";
import "./form.module.scss";

import { Autocomplete, Pagination, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArchive, faEye } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { ApiClient } from "../../../services/RestServices/BaseRestServices";
const FormComponent = () => {
  const imgDefault =
    "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
  const navigate = useNavigate();
  const [allEventList, setAllEventList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loader, setLoader] = useState(false);
  const [eventName, setEventName] = useState("");
  const rowsPerPage = 10;
  const nextBtn =
    "https://storage.googleapis.com/public-saral/public_document/button.png";

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
    <div className="home-main-container">
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
      <div className="home-search-div">
        <div className="event-header">
          <h1>Events</h1>
          <span className="sub-heading">List view of all the Events</span>
        </div>
        <TextField
          className="search-input"
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

      <div className="events-container">
        {allEventList.length > 0 ? (
          <>
            {allEventList.map((event) => (
              <div key={`${event.id}${event.name}`}>
                <div
                  className="event-list submit-btn cursor"
                  onClick={() => tabClickHandler(event?.id)}
                >
                  <div className="event-list-fir ">
                    <div>
                      <img
                        className="event-photo"
                        src={event.image_url ? event.image_url : imgDefault}
                      />
                    </div>
                    <div className="event-header-name">
                      <h2 className="event-header-name-ellipsis">
                        {event.name}
                      </h2>
                      <span className="event-sub-header">
                        Level : {event.data_level}
                      </span>
                    </div>
                    <div className={event.status.class_name}>
                      <span>{event.status.name}</span>
                    </div>
                    <div></div>
                  </div>
                  <div className="event-list-sec">
                    <div className="hr"></div>
                    <div className="event-list-item">
                      <h5>States</h5>

                      <span className="event-sub-header">{event.states}</span>
                    </div>
                    <div className="hr"></div>
                    <div className="event-list-item">
                      <h5>Start</h5>
                      <span className="event-sub-header">
                        {event.start_datetime}
                      </span>
                    </div>
                    <div className="hr"></div>
                    <div className="event-list-item">
                      <h5>End</h5>
                      <span className="event-sub-header">
                        {event.end_datetime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
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
    </div>
  );
};

export default FormComponent;
