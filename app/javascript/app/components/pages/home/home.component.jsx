import React, { useEffect, useState } from "react";
import "./home.module.scss";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Autocomplete,
  Pagination,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import IconButton from "@mui/material/IconButton";
import ConfirmationModal from "../../shared/ConfirmationModal/ConfirmationModal";
import ArchiveIcon from '@mui/icons-material/Archive';
import {EditButtonIcon,ViewButtonIcon} from '../../../assests/svg/index'
import moment from "moment";
import {ImageNotFound} from "../../../assests/png";

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
  const [eventName, setEventName] = useState(null);

  const filterList = ["Level", "State", "Event Status"];
  const [filtersFieldData, setFiltersFieldData] = useState({
    levels: [{id:"",name:""}],
    states: [{id:"",name:""}],
    event_status: eventStatusArray,
  });
  const [filtersFieldValue, setFiltersFieldValue] = useState({
    startDate:"",
    endDate:"",
    level_id: {name:"",id:"",level_class:""},
    state_id: {name:"",id:""},
    event_status_id: {name:"",id:""},
  });
  const [showConfirmationModal,setShowConfirmationModal]=useState(false);
  const [confirmationStatus,setConfirmationStatus]=useState(false);
  const [eventDeleteId,setEventDeleteId]=useState(-1);




  async function getApisValue(filerType, apiPath) {
    let levels = await fetch(`api/event/${apiPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "",
      },
    });
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
  

  const convertSnackCase = (value) => {
    return value.replace(/\s+/g, "_").toLowerCase();
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

  const setDate = (date,key) => {
    const dateValue=date?.$d;
    if(key==='endDate'){
      if(filtersFieldValue?.startDate===""||filtersFieldValue?.startDate===null||filtersFieldValue?.startDate===undefined){
        console.log('come inside here')
        setFiltersFieldValue({ ...filtersFieldValue, startDate:dateValue,[key]:dateValue });

      }
      else if(new Date(dateValue)<new Date(filtersFieldValue?.startDate)){
        setFiltersFieldValue({ ...filtersFieldValue, startDate:dateValue,[key]:dateValue });

      } else{
        setFiltersFieldValue({ ...filtersFieldValue, [key]:dateValue });

      }

    }
    if(key==='startDate'){
        if(new Date(filtersFieldValue?.endDate)<new Date(dateValue)){
          setFiltersFieldValue({ ...filtersFieldValue, endDate:dateValue ,[key]:dateValue });

        } else{
          setFiltersFieldValue({ ...filtersFieldValue, [key]:dateValue });

        }
    }

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
    setLoader(true);
    const params = `search_query=${eventName??""}&start_date=${filtersFieldValue?.startDate!==null&&filtersFieldValue?.startDate!==undefined&&filtersFieldValue?.startDate!==""?
        moment(filtersFieldValue.startDate).format('DD/MM/YYYY'):""
   
    }&end_date=${filtersFieldValue?.endDate!==null&&filtersFieldValue?.endDate!==undefined&&filtersFieldValue?.endDate!==""?
        moment(filtersFieldValue.endDate).format('DD/MM/YYYY'):""

    }&level_id=${filtersFieldValue.level_id?.id??""}&state_id=${
      filtersFieldValue.state_id?.id??""
    }&event_status=${
      filtersFieldValue.event_status_id?.name??""
    }&limit=${itemsPerPage}&offset=${itemsPerPage * (page - 1)}`;
    try {
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
        window.scrollTo({top: 0});

      } else {
        toast.error(`Please enter ${data.message}`, {
          autoClose: 2000,
        });
      }

    }catch (e){
       toast.error(e.message,{autoClose:2000})
    }

    setLoader(false);
  }

  useEffect(() => {
    getEventsList();
  }, [page, clearFilter]);

  const getFilterEvents = () => {
    if(page===1){
      console.log('appy is called')
      getEventsList();
    }else{
        setPage(1)
    }
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
      if(eventName!==null) {
        if (page === 1) {
          getEventsList();
        } else {
          setPage(1)

        }
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [eventName]);

 

  const handleAutoComplete=(event,newValue,name)=>{
    console.log('new value is ',newValue);
    if(name==='event_status_id'){
      setFiltersFieldValue((prevData)=>({...prevData,startDate: "",endDate: "", [name]:newValue}));

    }else{
      setFiltersFieldValue((prevData)=>({...prevData,[name]:newValue}));

    }

    
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
      <div  className="header-and-list-container">
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
                <div className="event-list" key={`${event.id}${event.name}`}>
                  <div className="visible-divs">
                    <div className="event-list-fir">
                      <img
                          className="event-photo"
                          src={event.image_url ? event?.image_url : ImageNotFound}
                      />
                      <div className="event-header-name">
                        <h2 className="event-header-name-ellipsis">
                          {event.name}
                        </h2>
                        <span className="event-sub-header">
                        Level : {event.data_level}
                      </span>
                      </div>
                      <div className={`${event.status.class_name} active-button` } >
                        <span>{event.status.name}</span>
                      </div>
                      <div></div>
                    </div>

                    <div className="event-list-sec">
                      <div className="hr"></div>
                      <div className="event-list-item">
                        <span>States</span>


                        <span className="event-sub-header">{event.states}</span>
                      </div>
                      <div className="hr"></div>
                      <div className="event-list-item">
                        <span>Start</span>
                        <span className="event-sub-header any-ellipsis">
                        {moment(event?.start_date).format("DD-MM-YYYY")}
                        </span>
                        <span className="event-sub-header any-ellipsis">
                        {moment(event?.start_date).format("hh:mm A")}
                        </span>
                      </div>
                      <div className="hr"></div>
                      <div className="event-list-item">
                        <span>End</span>
                        <span className="event-sub-header any-ellipsis">
                        {moment(event?.end_date).format("DD-MM-YYYY")}
                        </span>
                        <span className="event-sub-header">
                        {moment(event?.end_date).format("hh:mm A")}
                        </span>
                      </div>
                    </div>


                  </div>
                  <div className="edit-bar">
                    <div className="edit-bar-sub-div cursor-pointer"
                         onClick={() => navigate(`/events/view/${event?.id}`)}>
                      <IconButton>
                        <div className={"view-button"}>
                          <ViewButtonIcon  className={"view-icon"}/>
                        </div>
                      </IconButton>
                      <span className="font1-2rem">View</span>
                    </div>
                    <div
                        className="edit-bar-sub-div cursor-pointer"
                        onClick={() => EditEvent(event?.id)}
                    >
                      <IconButton>
                        <div className={"edit-button"} >
                          <EditButtonIcon className={"edit-icon"} />

                        </div>

                      </IconButton>
                      <span className="font1-2rem">Edit</span>
                    </div>

                    <div className="edit-bar-sub-div cursor-pointer" onClick={() => {
                      setEventDeleteId(event?.id)
                      setShowConfirmationModal(true)
                    }}>
                      <IconButton>
                        <ArchiveIcon className="event-list-icon" sx={{color: "orange"}}/>

                      </IconButton>
                      <span className="font1-2rem">Archive</span>
                    </div>


                  </div>


                </div>
            ))}
          </>
        ) : (
            <div className="no-event-data">No Data Found</div>
        )}
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

        
      </div>

      <div className="filters-container-main">
        <div className="filters-container">
          <h4>Filters</h4>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                disabled={filtersFieldValue?.event_status_id!==null&&filtersFieldValue?.event_status_id!==undefined&&filtersFieldValue?.event_status_id!==""&&filtersFieldValue?.event_status_id?.name!==""&&filtersFieldValue?.event_status_id?.id!==""}

                label="Start Date"
                format="DD/MM/YYYY"

                onChange={(date)=>setDate(date,"startDate")}
                value={
                  filtersFieldValue.startDate ? dayjs(filtersFieldValue.startDate) : null
                }
                slotProps={{
                  textField: {
                    readOnly: true,
                  },
                }}
            />
            <DatePicker
                disabled={filtersFieldValue?.event_status_id!==null&&filtersFieldValue?.event_status_id!==undefined&&filtersFieldValue?.event_status_id!==""&&filtersFieldValue?.event_status_id?.name!==""&&filtersFieldValue?.event_status_id?.id!==""}
                label="End Date"
                format="DD/MM/YYYY"

                onChange={(date)=>setDate(date,"endDate")}
                value={
                  filtersFieldValue.endDate ? dayjs(filtersFieldValue.endDate) : null
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
          <div className="filters-buttons">
            <button
                onClick={clearFiltersValue}
                className="clear-button"
                disabled={disableClearFilterButton()}
            >
              Clear
            </button>
            <button
                onClick={getFilterEvents}
                className="apply-button"
            >
              Apply
            </button>
          </div>
        </div>
        </div>


    </div>
  );
};

export default HomeComponent;
