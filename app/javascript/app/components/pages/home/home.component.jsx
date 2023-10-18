import React, { useEffect, useState } from "react";
import "./home.module.scss";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Autocomplete,
  Pagination,
  TablePagination,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArchive, faEye } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const HomeComponent = () => {
  const imgDefault =
    "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
  const navigate = useNavigate();
  const [eventsList, setEventsList] = useState([]);
  const [allEventList, setAllEventList] = useState([]);

  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [clearFilter, setClearFilter] = useState(false);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    console.log("event name is", eventName);
  }, [eventName]);

  const demoData = [
    {
      id: 1,
      name: "Active",
    },
    {
      id: 2,
      name: "Expired",
    },
    {
      id: 3,
      name: "Upcoming",
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
      pathname: "/event/create_event",
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
    setEventName("");
    setClearFilter(!clearFilter);
  };

  async function getEventsList() {
    const params = `search_query=${eventName}&start_date=${
      filtersFieldValue.date
    }&level_id=${filtersFieldValue.level_id}&state_id=${
      filtersFieldValue.state_id
    }&event_status=${
      filtersFieldValue.event_status_id
    }&limit=${itemsPerPage}&offset=${itemsPerPage * (page - 1)}`;
    let levels = await fetch(`api/event/event_list?` + params, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    });
    const res = await levels.json();
    if (res.success) {
      setEventsList(res.data);
      setAllEventList(res.data);
      setTotalCount(res?.total ?? res?.data?.length);
    } else {
      toast.error(`Please enter ${res.message}`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  }

  useEffect(() => {
    getEventsList();
  }, [page, clearFilter]);

  const getFilterEvents = () => {
    getEventsList();
  };

  function EditEvent(data, id) {
    navigate(
      {
        pathname: `/event/edit_event/${id}`,
      },
      {
        state: {
          event: data,
        },
      }
    );
  }

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  const disableClearFilterButton = () => {
    if (eventName !== "") return false;
    for (let key in filtersFieldValue) {
      if (filtersFieldValue[key] !== "") return false;
    }
    return true;
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
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="search-input"
          placeholder="Search by Event Name"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <button className="dynamic-form-submit-button" onClick={addEvent}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span>+</span>
            <span>Add Event</span>
          </div>
        </button>
      </div>

      <div className="filters-container-main">
        <div className="filters-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              onChange={setDate}
              value={
                filtersFieldValue.date ? dayjs(filtersFieldValue.date) : null
              }
              slotProps={{
                textField: {
                  readOnly: true,
                },
              }}
            />
          </LocalizationProvider>
          {filterList &&
            filterList.map((filter, index) => (
              <div className="dynamic-filters" key={index}>
                <Autocomplete
                  key={`${filter}${index}`}
                  className="w-100"
                  value={
                    getOptions(filter).find(
                      (value) => value.id === parseInt(fieldValue(filter))
                    ) || null
                  }
                  options={getOptions(filter)}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={handleFilterChange(filter, index)}
                  renderInput={(params) => (
                    <TextField {...params} label={`Select ${filter}`} />
                  )}
                />
              </div>
            ))}
        </div>
        <div className="filters-buttons">
          <button
            onClick={clearFiltersValue}
            className="btn btn-light clear-btn"
            disabled={disableClearFilterButton()}
          >
            Clear
          </button>
          <button
            onClick={getFilterEvents}
            className="btn btn-primary apply-btn"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="events-container">
        {allEventList.length > 0 ? (
          <>
            {allEventList.map((event) => (
              <div key={`${event.id}${event.name}`}>
                <div className="event-list">
                  <div className="event-list-fir visible-divs">
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

                  <div className="event-list-sec visible-divs">
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

                  <div className="edit-bar">
                    <div
                      className="edit-bar-sub-div cursor-pointer"
                      onClick={() => EditEvent(event, event?.id)}
                    >
                      <FontAwesomeIcon
                        className="edit-bar-imgage"
                        size="2x"
                        style={{ color: "blue" }}
                        icon={faPen}
                      />
                      <span className="font1-2rem">Edit</span>
                    </div>

                    <div className="edit-bar-sub-div cursor-pointer">
                      <FontAwesomeIcon
                        className="edit-bar-imgage"
                        size="2x"
                        style={{ color: "orange" }}
                        icon={faArchive}
                      />
                      <span className="font1-2rem">Archive</span>
                    </div>

                    <div className="edit-bar-sub-div cursor-pointer">
                      <FontAwesomeIcon
                        className="edit-bar-imgage"
                        size="2x"
                        style={{ color: "lightgreen" }}
                        icon={faEye}
                      />
                      <span className="font1-2rem">View</span>
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
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default HomeComponent;
