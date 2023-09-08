import React, {useEffect, useState} from 'react';
import './home.styles.scss'
import CreateEvent from '../create_event/createEvent'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Autocomplete, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen,faArchive, faEye } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';



const HomeComponent = () => {
    const imgDefault = 'https://storage.googleapis.com/public-saral/public_document/upload-img.jpg';
    const navigate = useNavigate()
    const [eventsList, setEventsList] = useState([])
    const [allEventList, setAllEventList] = useState([])
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredEventId, setHoveredEventId] = useState()
    const [LeftMargin, setLeftMargin] = useState(0);
    const demoData = [
        {
            id: 1,
            name: 'upcoming'
        },
        {
            id: 2,
            name: "active"
        },
        {
            id: 3,
            name: "expired"
        }
    ]
    const filterList = ["Level","State"]
    const [filtersFieldData, setFiltersFieldData] = useState({
        levels: [],
        states: [],
        event_status: demoData,
    });
    const [filtersFieldValue, setFiltersFieldValue] = useState({
        date : '',
        level_id: '',
        state_id: '',
        event_status_id: '',
    });


    async function getApisValue(filerType,apiPath) {
        let levels = await fetch(`api/event/${apiPath}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await levels.json();
        const transformedFilter = convertSnackCase(filerType)
        const key = filerType === 'Event Status' ? transformedFilter :`${transformedFilter}s`
        setFiltersFieldData((prevState) => ({
            ...prevState,
            [key]: res.data
        }));
    }


    const addEvent = () => {
        navigate(
            {
                pathname: '/create_event',
            },
        );
    }

    const getOptions = (filter) => {
        let data = []
        if (filter) {
            const transformedFilter = convertSnackCase(filter)
            data = filtersFieldData[filter === 'Event Status' ? transformedFilter :`${transformedFilter}s`
        ]
        }
        return data
    }
    const convertSnackCase = (value) => {
        return value.replace(/\s+/g, '_').toLowerCase();
    }

    const fieldValue = (filter) => {
        if (filter) {
            const transformedFilter = convertSnackCase(filter)
            return  filtersFieldValue[`${transformedFilter}_id`]
        }
    }

    const filterData = (searchTerm) => {
        let text = searchTerm.target.value
        if (!text) {
            setEventsList(allEventList);
        }

        if (text) {
            const searchTermLower = text.toLowerCase();
            const events = eventsList.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTermLower)
            );
            setEventsList(events)
        }

    };

    const handleFilterChange = (filterType,index) => (event, value) => {
        if (filterType) {
            let valueId = value.id
            if (filterType === 'Event Status'){
                valueId = value.name
            }
            setFieldvalue(filterType,valueId)
        }
    }
    const callApis = (fetchType,value) => {
        for (let i = 0; i < filterList.length; i++) {
            const filter = filterList[i]
            let apiPath = ''
            if (filter === 'Level') {
                apiPath = `data_levels`
            }
            if (filter === 'State') {
                apiPath = `states`
            }
            if (filter !== 'Event Status') {
                getApisValue(filter,apiPath)
            }
        }
    }

    useEffect(() => {
        callApis()
    }, []);

    const setFieldvalue = (filterFieldType, value) => {
        let transformedType = convertSnackCase(filterFieldType);
        setFiltersFieldValue((prevState) => ({
            ...prevState,
            [`${transformedType}_id`]: value
        }));

    }
    const setDate = (date) => {
        setFiltersFieldValue({ ...filtersFieldValue, date });
    };

    const clearFiltersValue = () => {
        for (let i = 0; i < filterList.length; i++) {
            const filter = filterList[i]
            setFieldvalue(filter,'')
        }
        setFiltersFieldValue({
            date : '',
            level_id: '',
            state_id: '',
            event_status_id: ''
        })
    }


    const data = [{
        name:"Mann Ki Baat",
        level:"state",
        states:[{id:1,name:"up"},
            {id:2,name:"assam"},
            {id:3,name:"delhi"}],
        status:"Active",
        startDate:'Thu Aug 03 2023 15:12:30 GMT+0530 (India Standard Time)',
        endDate:'Fri Aug 04 2023 15:12:30 GMT+0530 (India Standard Time)'}]


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

    async function getEventsList () {
        const params = `start_date=${filtersFieldValue.date}&level_id=${filtersFieldValue.level_id}&state_id=${filtersFieldValue.state_id}&event_status=${filtersFieldValue.event_status_id}`
        let levels = await fetch(`api/event/event_list?` + params, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": 'application/json',
                "Authorization": ''
            }
        });
        const res = await levels.json();
      if (res.success) {
          setEventsList(res.data)
          setAllEventList(res.data)
      }
      else {
          toast.error(`Please enter ${res.message}`, {
              position: "top-center",
              autoClose: false,
              theme: "colored",
          })
      }
    }

    useEffect(() => {
        getEventsList()
    }, []);

  const getFilterEvents = () => {
      getEventsList()
  }

    function toProperCase(inputString) {
        return inputString.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
    }

    const handleMouseEnter = (id)  => {
        setHoveredEventId(id)
        setIsHovered(true);
        for (let i = 0; i < 21; i++) {
            setTimeout(() => {
                if (LeftMargin < 20) {
                    setLeftMargin(LeftMargin + i);
                }
            }, i < 5 ? 1 : 50);
        }
    };

    const handleMouseLeave = () => {
        setHoveredEventId('')
        setIsHovered(false);
        setLeftMargin(0)
    };

    function EditEvent(event)  {
        navigate(
            {
                pathname: '/create_event',
            },
            {
                state: {
                    event: event
                }
            }
        );
    }

    return (
        <div className="home-main-container">
            <div className="home-search-div">
                <div className="event-header">
                    <h1>
                        Events
                    </h1>
                    <span className="sub-heading">List view of all the Events</span>
                </div>
                <input onChange={filterData} className="search-input" placeholder="Search by Event Name"/>
                <button
                    className='dynamic-form-submit-button'
                    onClick={addEvent}>
                    Add Event
                </button>
            </div>

            <div className="filters-container-main">
                <div className="filters-container">
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Start Date"
                                    onChange={setDate}
                                    value={filtersFieldValue.date ? dayjs(filtersFieldValue.date) : null}
                                    slotProps={{
                                        textField: {
                                            readOnly: true,
                                        },
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    {filterList && filterList.map((filter, index) => (
                        <div className="dynamic-filters">
                            <Autocomplete key={`${filter}${index}`}
                                          className="w-100"
                                          value={getOptions(filter).find(value => value.id === parseInt(fieldValue(filter))) || null}
                                          options={getOptions(filter)}
                                          getOptionLabel={(option) => option.name || ""}
                                          getOptionValue={(option) => {
                                             filter === 'Event Status' ? option.name : option.id
                                          }}
                                          onChange={handleFilterChange(filter, index)}
                                          renderInput={(params) => <TextField {...params} label={`Select ${filter}`}/>}
                            />
                        </div>
                    ))}
                </div>
                <div className="filters-buttons">
                    <button onClick={clearFiltersValue} className="btn btn-light clear-btn">
                        Clear
                    </button>
                    <button onClick={getFilterEvents} className="btn btn-primary apply-btn">
                        Apply
                    </button>
                </div>
            </div>

            <div className="events-container">
                {eventsList.length > 0 ? <>
                { eventsList.map((event) => (
                    <div key={`${event.id}${event.name}`}>
                        <div className="event-list"
                             onMouseEnter={() => handleMouseEnter(event.id)}
                             onMouseLeave={() => handleMouseLeave()}>

                            <div className="event-list-fir"  style={{marginLeft: isHovered && event.id === hoveredEventId? `-${LeftMargin}rem` : ''}}>
                                <div>
                                    <img className="event-photo" src={event.image_url ? event.image_url : imgDefault} />
                                </div>
                                <div className="event-header-name">
                                    <h2>
                                        {event.name}
                                    </h2>
                                    <span className="event-sub-header">
                                     Level : {event.data_level}
                                </span>
                                </div>
                                <div className={event.status.class_name}>
                                <span>
                                     {event.status.name}
                                </span>
                                </div>
                                <div>

                                </div>
                            </div>
                            <div className="event-list-sec">
                                <div className="hr"></div>
                                <div className="event-list-item">
                                    <h5>
                                        States
                                    </h5>

                                    <span className="event-sub-header">
                                     {event.states}
                                </span>
                                </div>
                                <div className="hr"></div>
                                <div className="event-list-item">
                                    <h5>
                                        Start
                                    </h5>
                                    <span className="event-sub-header">
                               {event.start_datetime}
                                </span>
                                </div>
                                <div className="hr"></div>
                                <div className="event-list-item">
                                    <h5>
                                        End
                                    </h5>
                                    <span className="event-sub-header">
                               {event.end_datetime}
                                </span>
                                </div>
                            </div>

                            <div className="edit-bar" style={{display : isHovered && event.id === hoveredEventId ?  '' : 'none'}} >
                                <div className="edit-bar-sub-div cursor-pointer" onClick={() => EditEvent(event)}>
                                    <FontAwesomeIcon className="edit-bar-imgage"
                                                     size="2x"
                                                     style={{ color: 'blue' }}
                                                     icon={faPen} />
                                    <span className="font1-2rem">
                                        Edit
                                    </span>
                                </div>

                                <div className="edit-bar-sub-div cursor-pointer">
                                    <FontAwesomeIcon className="edit-bar-imgage"
                                                     size="2x"
                                                     style={{ color: 'orange' }}
                                                     icon={faArchive} />
                                    <span className="font1-2rem">
                                          Archive
                                    </span>
                                </div>

                                <div className="edit-bar-sub-div cursor-pointer">
                                    <FontAwesomeIcon className="edit-bar-imgage"
                                                     size="2x"
                                                     style={{ color: 'lightgreen' }}
                                                     icon={faEye} />
                                    <span className="font1-2rem">
                                          View
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </>
                    :
                    <div className="no-event-data">
                        No Data Found
                    </div>
                }
            </div>

        </div>
    );
}

export default HomeComponent;