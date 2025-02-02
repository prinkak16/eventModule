import React, {useEffect, useState} from "react";
import "./home.module.scss";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

import {Autocomplete, Pagination, TextField,} from "@mui/material";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import IconButton from "@mui/material/IconButton";
import ConfirmationModal from "../../shared/ConfirmationModal/ConfirmationModal";
import {
    EditButtonIcon,
    HideButtonIcon,
    IntermediateEventIcon,
    LeafEventIcon,
    PrimaryEventIcon,
    UnhideButtonIcon,
    ViewButtonIcon
} from '../../../assests/svg/index'
import moment from "moment";
import {ImageNotFound} from "../../../assests/png";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import ReportEmailModal from "../../shared/ReportsModel/ReportEmailModal";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {hideUnhideEvents} from "../../../services/CommonServices/commonServices";

//static data
const eventLevelArray = [{id: 1, name: "Parent"}, {id: 2, name: "Intermediate"}, {id: 3, name: "Leaf"}]
const eventStatusArray = [{
    id: 1, name: "Active",
}, {
    id: 2, name: "Expired",
}, {
    id: 3, name: "Upcoming",
},];

const filterList = ["Level", "State", "Event Status"];

const HomeComponent = () => {

    const navigate = useNavigate();
    const [allEventList, setAllEventList] = useState([]);

    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [totalCount, setTotalCount] = useState(0);
    const [clearFilter, setClearFilter] = useState(false);
    const [eventName, setEventName] = useState(null);
    const [hideButtonLoader, setHideButtonLoader] = useState(false);
    const [filtersFieldData, setFiltersFieldData] = useState({
        levels: [{id: "", name: ""}],
        states: [{id: "", name: ""}],
        event_status: eventStatusArray,
        event_level: eventLevelArray
    });
    const [filtersFieldValue, setFiltersFieldValue] = useState({
        startDate: "",
        endDate: "",
        level_id: {name: "", id: "", level_class: ""},
        state_id: {name: "", id: ""},
        event_status_id: {name: "", id: ""},
        event_level: {name: "Parent", id: "1"},
    });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationStatus, setConfirmationStatus] = useState(false);
    const [eventDeleteId, setEventDeleteId] = useState(-1);
    const [reportEventId, setReportEventId] = useState("");
    const [reportModal, setReportModal] = useState(false);

    //states relate to hide-unhide-modal
    const [hideUnhideData, setHideUnhideData] = useState({
        title: "",
        message: "",
        body: "",
        confirmationButtonText: "",
        note: "",
        event_id: "",
        is_hidden: ""
    });

    useEffect(() => {
        getEventsList();
    }, [page, clearFilter]);

    useEffect(() => {
        callApis();
    }, []);

    useEffect(() => {
        if (confirmationStatus) {
            hideAndUnhideEvents();
        }
    }, [confirmationStatus]);

    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            if (eventName !== null) {
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

    async function getApisValue(filerType, apiPath) {
        let levels = await fetch(`api/event/${apiPath}`, {
            method: "GET", headers: {
                "Content-Type": "application/json", Accept: "application/json", Authorization: "",
            },
        });
        const res = await levels.json();
        const transformedFilter = convertSnackCase(filerType);
        const key = filerType === "Event Status" ? transformedFilter : `${transformedFilter}s`;
        setFiltersFieldData((prevState) => ({
            ...prevState, [key]: res.data,
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
    const setFieldvalue = (filterFieldType, value) => {
        let transformedType = convertSnackCase(filterFieldType);
        setFiltersFieldValue((prevState) => ({
            ...prevState, [`${transformedType}_id`]: value,
        }));
    };

    const setDate = (date, key) => {
        const dateValue = date?.$d;
        if (key === 'endDate') {
            if (filtersFieldValue?.startDate === "" || filtersFieldValue?.startDate === null || filtersFieldValue?.startDate === undefined) {
                setFiltersFieldValue({...filtersFieldValue, startDate: dateValue, [key]: dateValue});

            } else if (new Date(dateValue) < new Date(filtersFieldValue?.startDate)) {
                setFiltersFieldValue({...filtersFieldValue, startDate: dateValue, [key]: dateValue});

            } else {
                setFiltersFieldValue({...filtersFieldValue, [key]: dateValue});

            }

        }
        if (key === 'startDate') {
            if (new Date(filtersFieldValue?.endDate) < new Date(dateValue)) {
                setFiltersFieldValue({...filtersFieldValue, endDate: dateValue, [key]: dateValue});

            } else {
                setFiltersFieldValue({...filtersFieldValue, [key]: dateValue});

            }
        }

    };

    const clearFiltersValue = () => {
        for (let i = 0; i < filterList.length; i++) {
            const filter = filterList[i];
            setFieldvalue(filter, "");
        }
        setFiltersFieldValue({
            date: "", level_id: {id: "", name: ""}, state_id: {id: "", name: ""}, event_status_id: {id: "", name: ""},
            event_level: {id: 1, name: ""}
        });
        setEventName("");
        setClearFilter(!clearFilter);
    };

    async function getEventsList() {
        setLoader(true);
        const params = `search_query=${eventName ?? ""}&start_date=${filtersFieldValue?.startDate !== null && filtersFieldValue?.startDate !== undefined && filtersFieldValue?.startDate !== "" ? filtersFieldValue.startDate : ""

        }&end_date=${filtersFieldValue?.endDate !== null && filtersFieldValue?.endDate !== undefined && filtersFieldValue?.endDate !== "" ? filtersFieldValue.endDate : ""

        }&level_id=${filtersFieldValue.level_id?.id ?? ""}&state_id=${filtersFieldValue.state_id?.id ?? ""}&event_status=${filtersFieldValue.event_status_id?.name ?? ""}&event_level=${filtersFieldValue?.event_level?.name ?? ""}&limit=${itemsPerPage}&offset=${itemsPerPage * (page - 1)}`;
        try {
            let {data} = await ApiClient.get(`/event/event_list?` + params, {
                headers: {
                    "Content-Type": "application/json", Accept: "application/json", Authorization: "",
                },
            });
            if (data?.success) {
                setAllEventList(data?.data);
                setTotalCount(data?.total ?? data?.data?.length);
                window.scrollTo({top: 0});

            } else {
                toast.error(`Please enter ${data.message}`, {
                    autoClose: 2000,
                });
            }

        } catch (e) {
            toast.error(e.message, {autoClose: 2000})
        }

        setLoader(false);
    }

    const getFilterEvents = () => {
        if (page === 1) {
            getEventsList();
        } else {
            setPage(1)
        }
    };

    function EditEvent(id) {
        navigate(`/events/edit/${id}`);
    }

    // const archieveHandler = async () => {
    //     const {data} = await ApiClient.get(`event/archive/${eventDeleteId}`)
    //     if (data?.success) {
    //         setAllEventList(allEventList?.filter((event) => event?.id !== eventDeleteId));
    //     }
    //     setConfirmationStatus(false);
    //
    //
    // }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const disableClearFilterButton = () => {
        if (eventName !== "") return false;
        for (let key in filtersFieldValue) {
            if (filtersFieldValue[key] !== "") return false;
        }
        return true;
    };

    const handleAutoComplete = (event, newValue, name) => {
        if (name === 'event_status_id') {
            setFiltersFieldValue((prevData) => ({...prevData, startDate: "", endDate: "", [name]: newValue}));

        } else {
            setFiltersFieldValue((prevData) => ({...prevData, [name]: newValue}));
        }

    }

    const handleEventClick = (event_id) => {
        navigate(`/events/${event_id}`)
    }

    const hideAndUnhideEvents = async () => {
        const body = {
            is_hidden: !hideUnhideData?.is_hidden,
            event_id: hideUnhideData?.event_id
        }
        setHideButtonLoader(true);
        try {
            const {data} = await hideUnhideEvents(body);
            if (data?.success) {
                //updating the eventlist from front-end
                const indexOfHideEvent = allEventList?.findIndex((event) => event?.id === body?.event_id)
                let currentEvent = allEventList[indexOfHideEvent];
                currentEvent["is_hidden"] = body?.is_hidden;
                const updatedEventList = [...allEventList];
                updatedEventList?.splice(indexOfHideEvent, 1, currentEvent); //replaces old event with updated event
                setAllEventList(updatedEventList);
                toast.success(data?.message);

            } else {
                toast.error(data?.success)
            }
        } catch (e) {
            toast.error(e?.message);
        } finally {
            setHideButtonLoader(false)
            setConfirmationStatus(false);
        }
    }

    const enableHideConfirmationModal = (body) => {
        const title = body?.is_hidden ? "Unhide Event" : "Hide Event";
        const message = body?.is_hidden ? "Are you sure you want to unhide the event?" : "Are you sure you want to hide the event?";
        const confirmationButtonText = body?.is_hidden ? "Unhide" : "Hide";
        const note = body?.is_hidden ? "Unhiding this event will show its sub-events to users" : "Hiding this event will hide its sub-events from users"
        setHideUnhideData((prevData) => ({
            ...prevData,
            message: message,
            title: title,
            confirmationButtonText: confirmationButtonText,
            event_id: body?.event_id,
            is_hidden: body?.is_hidden,
            note: note
        }))
        setShowConfirmationModal(true)
    }
    const RenderEventIcon = (event_level) => {
        if (event_level.toLowerCase() === 'parent') {
            return <span className={"event-primary-icon-container"}><PrimaryEventIcon/></span>
        } else if (event_level.toLowerCase() === 'intermediate') {
            return <span className={"event-intermediate-icon-container"}><IntermediateEventIcon/></span>
        } else {
            return <span className={"event-leaf-icon-container"}><LeafEventIcon/></span>
        }

    }

    return <div className="home-main-container">
        <ConfirmationModal title={hideUnhideData?.title} message={hideUnhideData?.message} note={hideUnhideData?.note}
                           showConfirmationModal={showConfirmationModal}
                           setShowConfirmationModal={setShowConfirmationModal}
                           setConfirmationStatus={setConfirmationStatus}
                           confirmationButtonText={hideUnhideData?.confirmationButtonText}/>
        <ReportEmailModal reportModal={reportModal} setReportModal={setReportModal} reportEventId={reportEventId}/>
        {loader ? <Loader
            type="bubble-ping"
            bgColor={"#FFFFFF"}
            title="Loading.."
            color={"#FFFFFF"}
            size={100}
        /> : <></>}
        <div className="header-and-list-container">
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
                        startAdornment: <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>,
                    }}
                />

                <button className="dynamic-form-submit-button" onClick={addEvent}>
                    + Add Event
                </button>
            </div>
            <div className={"home-icon-description"}>
                <span className={"svg-icon-outermost-container"}>
                    <span className={"primary-icon-container"}>
                                            <PrimaryEventIcon/>

                    </span>
                    <span>Primary Events</span>
                </span>
                <span className={"svg-icon-outermost-container"}>
                    <span className={"intermediate-icon-container"}>
                        <IntermediateEventIcon/>

                    </span>
                    <span>Intermediate Events</span>
                </span>
                <span className={"svg-icon-outermost-container"}>
                    <span className={"leaf-icon-container"}>
                                           <LeafEventIcon className={"leaf-icon"}/>

                    </span>
                    <span>Leaf Events</span>
                </span>
            </div>
            <div className="events-container">
                {allEventList.length > 0 ? <>
                    {allEventList.map((event) => (<div className="event-list" key={`${event.id}${event.name}`}>
                        <div className="visible-divs">
                            <div className="event-list-fir">
                                <img
                                    loading={"lazy"}
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
                                <div className={"active-hide-tag-container"}>
                                    <div className={`${event.status.class_name} active-button`}>
                                        <span>{event.status.name}</span>
                                    </div>
                                    {event?.is_hidden &&
                                        <div className={`${event.status.class_name} active-button hide-tag`}>
                                            <span>Hidden</span>
                                        </div>
                                    }
                                </div>

                                <div>
                                    {RenderEventIcon(event?.event_level)}
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
                                 onClick={() => navigate(`/events/${event?.id}`)}>
                                <IconButton>
                                    <div className={"view-button"}>
                                        <ViewButtonIcon className={"view-icon"}/>
                                    </div>
                                </IconButton>
                                <span className="font1-2rem">View</span>
                            </div>
                            <div
                                className="edit-bar-sub-div cursor-pointer"
                                onClick={() => EditEvent(event?.id)}
                            >
                                <IconButton>
                                    <div className={"edit-button"}>
                                        <EditButtonIcon className={"edit-icon"}/>

                                    </div>

                                </IconButton>
                                <span className="font1-2rem">Edit</span>
                            </div>
                            <button
                                disabled={hideButtonLoader}
                                className="edit-bar-sub-div cursor-pointer hide-button-style"
                                onClick={() => {
                                    const body = {
                                        event_id: event?.id,
                                        is_hidden: event?.is_hidden
                                    }
                                    enableHideConfirmationModal(body)
                                }
                                }
                            >


                                <IconButton disabled={hideButtonLoader}>
                                    {hideButtonLoader && <CircularProgress/>}
                                    {!hideButtonLoader && <div className={"hide-unhide-button"}>
                                        {event?.is_hidden ? <UnhideButtonIcon className={"hide-unhide-icon"}/> :
                                            <HideButtonIcon className={"hide-unhide-icon"}/>}
                                    </div>
                                    }

                                </IconButton>


                                <span className="font1-2rem">{event?.is_hidden ? "Unhide" : "Hide"}</span>
                            </button>


                            {/*<div className="edit-bar-sub-div cursor-pointer" onClick={() => {*/}
                            {/*    setEventDeleteId(event?.id)*/}
                            {/*    setShowConfirmationModal(true)*/}
                            {/*}}>*/}
                            {/*    <IconButton>*/}
                            {/*        <ArchiveIcon className="event-list-icon" sx={{color: "orange"}}/>*/}

                            {/*    </IconButton>*/}
                            {/*    <span className="font1-2rem">Archive</span>*/}
                            {/*</div>*/}

                            {event?.create_form_url == "" ? null :
                                <div className="edit-bar-sub-div cursor-pointer" onClick={() => {
                                    setReportEventId(event?.id)
                                    setReportModal(true)
                                }}>
                                    <IconButton>
                                        <FileDownloadIcon className="event-list-icon" sx={{color: "orange"}}/>

                                    </IconButton>
                                    <span className="font1-2rem">Report</span>
                                </div>}


                        </div>


                    </div>))}
                </> : <div className="no-event-data">No Data Found</div>}
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
                        disabled={filtersFieldValue?.event_status_id !== null && filtersFieldValue?.event_status_id !== undefined && filtersFieldValue?.event_status_id !== "" && filtersFieldValue?.event_status_id?.name !== "" && filtersFieldValue?.event_status_id?.id !== ""}

                        label="Start Date"
                        format="DD/MM/YYYY"

                        onChange={(date) => setDate(date, "startDate")}
                        value={filtersFieldValue.startDate ? dayjs(filtersFieldValue.startDate) : null}
                        slotProps={{
                            textField: {
                                readOnly: true,
                            },
                        }}
                    />
                    <DatePicker
                        disabled={filtersFieldValue?.event_status_id !== null && filtersFieldValue?.event_status_id !== undefined && filtersFieldValue?.event_status_id !== "" && filtersFieldValue?.event_status_id?.name !== "" && filtersFieldValue?.event_status_id?.id !== ""}
                        label="End Date"
                        format="DD/MM/YYYY"

                        onChange={(date) => setDate(date, "endDate")}
                        value={filtersFieldValue.endDate ? dayjs(filtersFieldValue.endDate) : null}
                        slotProps={{
                            textField: {
                                readOnly: true,
                            },
                        }}
                    />

                </LocalizationProvider>

                <Autocomplete
                    fullWidth
                    options={filtersFieldData["levels"]}
                    getOptionLabel={(option) => option?.name}
                    value={filtersFieldValue?.level_id}
                    onChange={(e, newVal) => handleAutoComplete(e, newVal, "level_id")}
                    renderInput={(params) => <TextField {...params} label="Select Level" variant="outlined"/>}
                />

                <Autocomplete
                    fullWidth

                    options={filtersFieldData["states"]}
                    getOptionLabel={(option) => option?.name}
                    value={filtersFieldValue?.state_id}
                    onChange={(e, newVal) => handleAutoComplete(e, newVal, "state_id")}
                    renderInput={(params) => <TextField {...params} label="Select States" variant="outlined"/>}
                />
                <Autocomplete
                    fullWidth

                    options={filtersFieldData["event_status"]}
                    getOptionLabel={(option) => option?.name}
                    value={filtersFieldValue?.event_status_id}
                    onChange={(e, newVal) => handleAutoComplete(e, newVal, "event_status_id")}
                    renderInput={(params) => <TextField {...params} label="Select Event Status"
                                                        variant="outlined"/>}
                />
                <Autocomplete
                    fullWidth
                    options={filtersFieldData["event_level"]}
                    getOptionLabel={(option) => option?.name}
                    value={filtersFieldValue?.event_level}
                    onChange={(e, newVal) => handleAutoComplete(e, newVal, "event_level")}
                    renderInput={(params) => <TextField {...params} label="Select Event Hierarchy"
                                                        variant="outlined"/>}
                />
                <div className="filters-buttons">
                    <Button
                        onClick={clearFiltersValue}
                        className="clear-button"
                        disabled={disableClearFilterButton()}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={getFilterEvents}
                        className="apply-button"
                        variant={"contained"}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </div>


    </div>;
};

export default HomeComponent;