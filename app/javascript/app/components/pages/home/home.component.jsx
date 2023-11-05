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
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import IconButton from "@mui/material/IconButton";
import ConfirmationModal from "../../shared/ConfirmationModal/ConfirmationModal";
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

const HomeComponent = () => {
  const eventStatusArray = [
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

  const filterList = ["Level", "State", "Event Status"];
  const [filtersFieldData, setFiltersFieldData] = useState({
    levels: [{id:"",name:""}],
    states: [{id:"",name:""}],
    event_status: eventStatusArray,
  });
  const [filtersFieldValue, setFiltersFieldValue] = useState({
    date: "",
    level_id: {name:"",id:"",level_class:""},
    state_id: {name:"",id:""},
    event_status_id: {name:"",id:""},
  });
  const [showConfirmationModal,setShowConfirmationModal]=useState(false);
  const [confirmationStatus,setConfirmationStatus]=useState(false);
  const [eventDeleteId,setEventDeleteId]=useState(-1);




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
      pathname: "/events/create",
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

  useEffect(() => {
    if(confirmationStatus){
      archieveHandler();
    }
  }, [confirmationStatus]);

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
      level_id: {id:"",name:""},
      state_id:  {id:"",name:""},
      event_status_id:  {id:"",name:""},
    });
    setEventName("");
    setClearFilter(!clearFilter);
  };

  async function getEventsList() {
    console.log('called get ')
    const params = `search_query=${eventName}&start_date=${
      filtersFieldValue.date
    }&level_id=${filtersFieldValue.level_id?.id??""}&state_id=${
      filtersFieldValue.state_id?.id??""
    }&event_status=${
      filtersFieldValue.event_status_id?.name??""
    }&limit=${itemsPerPage}&offset=${itemsPerPage * (page - 1)}`;
    let {data} = await ApiClient.get(`/event/event_list?` + params, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    });
    if (data?.success) {
      setEventsList(data?.data);
      setAllEventList(data?.data);
      setTotalCount(data?.total ?? data?.data?.length);
    } else {
      toast.error(`Please enter ${data.message}`, {
        autoClose: 2000,
      });
    }
  }

  useEffect(() => {
    getEventsList();
  }, [page, clearFilter,filtersFieldValue]);

  const getFilterEvents = () => {
    getEventsList();
  };

  function EditEvent( id) {
    navigate(`/events/edit/${id}`)  ;
  }


  const archieveHandler=async ()=>{
    const {data}=await  ApiClient.get(`event/archive/${eventDeleteId}`)
    if(data?.success){
      setAllEventList(allEventList?.filter((event)=>event?.id!==eventDeleteId)) ;
    }
    setConfirmationStatus(false);



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
      if(page===1){
         getEventsList();
      } else{
        setPage(1)

      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [eventName]);

  useEffect(() => {
    console.log('filters data',filtersFieldValue
    )
  }, [filtersFieldValue]);

  const handleAutoComplete=(event,newValue,name)=>{
    console.log('new value is ',newValue);
    setFiltersFieldValue((prevData)=>({...prevData,[name]:newValue}));
    
    
  }
  return (
    <div className="home-main-container">
      <ConfirmationModal message="Are you sure want to archive ?" showConfirmationModal={showConfirmationModal} setShowConfirmationModal={setShowConfirmationModal} setConfirmationStatus={setConfirmationStatus}/>
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
      <div style={{width:"75%"}}>
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
                      <span className="event-sub-header any-ellipsis">
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
                      onClick={() => EditEvent(event?.id)}
                    >
                      <IconButton>
                     <EditIcon className="event-list-icon" sx={{color:"#3193FF"}}/>
                      </IconButton>
                      <span className="font1-2rem">Edit</span>
                    </div>

                    <div className="edit-bar-sub-div cursor-pointer" onClick={()=> {
                      setEventDeleteId(event?.id)
                      setShowConfirmationModal(true)
                    }}>
                      <IconButton>
                        <ArchiveIcon className="event-list-icon" sx={{color:"orange"}}/>
                        
                      </IconButton>
                      <span className="font1-2rem">Archive</span>
                    </div>

                    <div className="edit-bar-sub-div cursor-pointer"  onClick={()=>navigate(`/events/view/${event?.id}`)}>
                      <IconButton>
                      <RemoveRedEyeIcon className="event-list-icon" sx={{color:"#60D669"}}/>
                      </IconButton>
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

      <div className="filters-container-main">
        <div className="filters-container">
          <h4>Filters</h4>
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


          {/*  {filterList &&
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
            ))}*/}

          <Autocomplete
             fullWidth


              options={filtersFieldData["levels"]}
              getOptionLabel={(option) => option?.name}
              value={filtersFieldValue?.level_id}
              onChange={(e,newVal)=>handleAutoComplete(e,newVal,"level_id")}
              renderInput={(params) => <TextField {...params} label="Select Level" variant="outlined" />}
          />

          <Autocomplete
              fullWidth

              options={filtersFieldData["states"]}
              getOptionLabel={(option) => option?.name}
              value={filtersFieldValue?.state_id}
              onChange={(e,newVal)=>handleAutoComplete(e,newVal,"state_id")}
              renderInput={(params) => <TextField {...params} label="Select States" variant="outlined" />}
          />
          <Autocomplete
             fullWidth

              options={filtersFieldData["event_status"]}
              getOptionLabel={(option) => option?.name}
              value={filtersFieldValue?.event_status_id}
              onChange={(e,newVal)=>handleAutoComplete(e,newVal,"event_status_id")}
              renderInput={(params) => <TextField {...params} label="Select Event Status" variant="outlined" />}
          />
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

    </div>
  );
};

export default HomeComponent;
