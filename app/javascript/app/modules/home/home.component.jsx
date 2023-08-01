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

const HomeComponent = () => {
    const eventPhoto = 'https://firebasestorage.googleapis.com/v0/b/bjp-saral.appspot.com/o/9saalbemisaal_stage0b1d0d38-d051-4838-b6cd-1884f05f27c799512.png?alt=media&token=6dec5362-b272-44b2-b0ee-32e92686a2cd'
    const navigate = useNavigate()
    const demoData = [
        {
            id: 1,
            name: "okay"
        },
        {
            id: 2,
            name: "not okay"
        }
    ]
    const filterList = ["Level","State","Event Status"]
    const [filtersFieldData, setFiltersFieldData] = useState({
        levels: [],
        states: [],
        event_status: [],
    });
    const [filtersFieldValue, setFiltersFieldValue] = useState({
        date : null,
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

    const setDate = (event) => {
        filtersFieldValue.date = event.$d
        console.log(filtersFieldValue.date)
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

    const handleFilterChange = (filterType,index) => (event, value) => {
        if (filterType) {
            setFieldvalue(filterType,value.id)
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
            if (filter === 'Event Status') {
                apiPath = `events_status`
            }
            getApisValue(filter,apiPath)
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

    const clearFiltersValue = () => {
        for (let i = 0; i < filterList.length; i++) {
            const filter = filterList[i]
            setFieldvalue(filter,'')
        }
        const extraFilter = 'date'
        setFiltersFieldValue((prevState) => ({
            ...prevState,
            [extraFilter]: ''
        }));
        console.log(filtersFieldValue)
    }

    const events = [1,2,3,4,5,6,7,8,9,0]
    return (
        <div className="home-main-container">
            <div className="home-search-div">
                <div className="event-header">
                    <h1>
                        Events
                    </h1>
                    <span className="sub-heading">List view of all the Events</span>
                </div>
                <input className="search-input" placeholder="Search by Event Name"/>
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
                                <DatePicker label="Date"
                                            onChange={setDate}
                                            value={filtersFieldValue.date ? dayjs(filtersFieldValue.date) : null}
                                            slotProps={{
                                                textField: {
                                                    readOnly: true,
                                                },
                                            }}/>
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
                                          getOptionValue={(option) => option.id || ""}
                                          onChange={handleFilterChange(filter, index)}
                                          renderInput={(params) => <TextField {...params} label={`Select ${filter}`}/>}
                            />
                        </div>
                    ))}
                </div>
                <div className="filters-buttons">
                    <button onClick={clearFiltersValue} className="btn btn-light clear-btn">
                        clear
                    </button>
                    <button className="btn btn-primary apply-btn">
                        Apply
                    </button>
                </div>
            </div>

            <div className="events-container">
                {events && events.map((event) => (
                    <div className="event-list">
                        <div className="event-list-fir">
                            <div>
                                <img className="event-photo" src={eventPhoto}/>
                            </div>
                            <div className="event-header-name">
                                    <h2>
                                        Mann ki Baat
                                    </h2>
                                    <span className="event-sub-header">
                                     Level : State
                                </span>
                            </div>
                            <div className="event-status">
                                <span className={`event-status-heading ${event === 2 || event === 4 ? 'status-expired' : 'status-active'} ${event === 3 || event === 5 ? 'status-upcoming' : 'status-active'}`}>
                                     {event === 2 || event === 4 ? 'Expired' : event === 3 || event === 5 ? 'Upcoming' : 'Active'}
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
                                     Uttar Pradesh,
                                </span>
                                <span className="event-sub-header">
                                     Assam +5
                                </span>
                            </div>
                            <div className="hr"></div>
                            <div className="event-list-item">
                                <h5>
                                    Start
                                </h5>
                                <span className="event-sub-header">
                                  23-01-2022
                                </span>
                                <span className="event-sub-header">
                                     06:30 PM
                                </span>
                            </div>
                            <div className="hr"></div>
                            <div className="event-list-item">
                                <h5>
                                    End
                                </h5>
                                <span className="event-sub-header">
                               29-01-2022
                                </span>
                                <span className="event-sub-header">
                                     08:00 PM
                                </span>
                            </div>
                        </div>

                    </div>

                    ))}
            </div>

        </div>
    );
}

export default HomeComponent;