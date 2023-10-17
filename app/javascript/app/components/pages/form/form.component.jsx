import React, { useEffect, useState } from "react";
import "./form.module.scss";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Autocomplete, Pagination, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArchive, faEye } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const FormComponent = () => {
  const imgDefault =
    "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
  const navigate = useNavigate();
  const [eventsList, setEventsList] = useState([]);
  const [allEventList, setAllEventList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loader, setLoader] = useState(false);
  const [eventName, setEventName] = useState("");
  const rowsPerPage = 10;
  const nextBtn =
    "https://storage.googleapis.com/public-saral/public_document/button.png";
  const demoData = [
    {
      id: 1,
      name: "upcoming",
    },
    {
      id: 2,
      name: "active",
    },
    {
      id: 3,
      name: "expired",
    },
  ];
  const filterList = ["Level", "State", "Event Status"];
  const [filtersFieldData, setFiltersFieldData] = useState({
    levels: [],
    states: [],
    event_status: demoData,
  });
  const [filtersFieldValue, setFiltersFieldValue] = useState({
    date: "",
    level_id: "",
    state_id: "",
    event_status_id: "",
  });

  async function getApisValue(filerType, apiPath) {
    setLoader(true);
    let levels = await fetch(`api/event/${apiPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    });
    setLoader(false);
    const res = await levels.json();
    const transformedFilter = convertSnackCase(filerType);
    const key =
      filerType === "Event Status"
        ? transformedFilter
        : `${transformedFilter}s`;
    setFiltersFieldData((prevState) => ({
      ...prevState,
      [key]: res.data,
    }));
  }

  const addEvent = () => {
    navigate({
      pathname: "/create_event",
    });
  };

  const getOptions = (filter) => {
    let data = [];
    if (filter) {
      const transformedFilter = convertSnackCase(filter);
      data =
        filtersFieldData[
          filter === "Event Status"
            ? transformedFilter
            : `${transformedFilter}s`
        ];
    }
    return data;
  };
  const convertSnackCase = (value) => {
    return value.replace(/\s+/g, "_").toLowerCase();
  };

  const fieldValue = (filter) => {
    if (filter) {
      const transformedFilter = convertSnackCase(filter);
      return filtersFieldValue[`${transformedFilter}_id`];
    }
  };

  const filterData = (searchTerm) => {
    let text = searchTerm.target.value;
    if (!text) {
      setEventsList(allEventList);
    }

    if (text) {
      const searchTermLower = text.toLowerCase();
      const events = eventsList.filter((item) =>
        item.name.toLowerCase().includes(searchTermLower)
      );
      setEventsList(events);
    }
  };

  const handleFilterChange = (filterType, index) => (event, value) => {
    if (filterType) {
      let valueId = value.id;
      if (filterType === "Event Status") {
        valueId = value.name;
      }
      setFieldvalue(filterType, valueId);
    }
  };
  const callApis = (fetchType, value) => {
    for (let i = 0; i < filterList.length; i++) {
      const filter = filterList[i];
      let apiPath = "";
      if (filter === "Level") {
        apiPath = `data_levels`;
      }
      if (filter === "State") {
        apiPath = `states`;
      }
      if (filter !== "Event Status") {
        getApisValue(filter, apiPath);
      }
    }
  };

  useEffect(() => {
    callApis();
  }, []);

  const setFieldvalue = (filterFieldType, value) => {
    let transformedType = convertSnackCase(filterFieldType);
    setFiltersFieldValue((prevState) => ({
      ...prevState,
      [`${transformedType}_id`]: value,
    }));
  };
  const setDate = (date) => {
    setFiltersFieldValue({ ...filtersFieldValue, date });
  };

  const clearFiltersValue = () => {
    for (let i = 0; i < filterList.length; i++) {
      const filter = filterList[i];
      setFieldvalue(filter, "");
    }
    setFiltersFieldValue({
      date: "",
      level_id: "",
      state_id: "",
      event_status_id: "",
    });
  };

  const data = [
    {
      name: "Mann Ki Baat",
      level: "state",
      states: [
        { id: 1, name: "up" },
        { id: 2, name: "assam" },
        { id: 3, name: "delhi" },
      ],
      status: "Active",
      startDate: "Thu Aug 03 2023 15:12:30 GMT+0530 (India Standard Time)",
      endDate: "Fri Aug 04 2023 15:12:30 GMT+0530 (India Standard Time)",
    },
  ];

  function convertToDate(dateString) {
    // Create a new Date object using the provided date string
    const date = new Date(dateString);

    // Get the date components (year, month, day) and create a new Date object with only the date part
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed, so add 1 to get the correct month number
    const day = date.getDate();
    const newDate = new Date(`${year}-${month}-${day}`);
    return newDate;
  }

  async function getEventsList() {
    const params = `event_name=${eventName}&start_date=${
      filtersFieldValue.date
    }&level_id=${filtersFieldData?.level_id}&state_id=${
      filtersFieldValue.state_id
    }&event_status=${
      filtersFieldValue.event_status_id
    }&limit=${rowsPerPage}&offset=${rowsPerPage * (page - 1)}`;
    // const params={
    //   event_name:eventName,
    //   start_date:filtersFieldValue?.date,
    //   level_id:filtersFieldValue.level_id,
    //   state_id:filtersFieldValue?.state_id,
    //   event_status:filtersFieldValue?.event_status_id,
    //   limit:rowsPerPage,
    //   offset:rowsPerPage*(page-1)
    // }
    let resopnse = await fetch(`api/event/event_list?` + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    });
    const res = await resopnse.json();
    console.log(res);
    if (res.success) {
      setEventsList(res.data);
      setAllEventList(res.data);
      setTotalCount(res?.count ?? res?.data?.length);
    } else {
      toast.error(`Please enter ${res.message}`, {
        position: "top-center",
        autoClose: false,
        theme: "colored",
      });
    }
  }

  useEffect(() => {
    getEventsList();
  }, [page]);

  const getFilterEvents = () => {
    getEventsList();
  };

  const submit = (url) => {
    window.location.href = url;
  };

  function toProperCase(inputString) {
    return inputString
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  }

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
                  onClick={() => submit(event.submit_form_url)}
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
