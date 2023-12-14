import React, {useEffect, useState} from "react";
import "./event-child-card.scss";
import {
    CalenderIcon,
    ClockIcon,
    IntermediateEventIcon, LeafEventIcon,
    LocationIcon,
    PrimaryEventIcon
} from "../../../../../../assests/svg";
import moment from "moment";
import {ImageNotFound} from "../../../../../../assests/png"
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {IconButton} from "@mui/material";
import {ApiClient} from '../../../../../../services/RestServices/BaseRestServices'
import {toast} from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const EventChildCard = ({event}) => {
    const {id} = useParams();

    const navigate = useNavigate();
    const [childrenEvents, setChildrenEvents] = useState([]);
    const [showChildrenEvents, setShowChildrenEvents] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const submissionHandler = (event_id, event_level) => {
        console.log('event label is ', event_level)

        if (String(id) === String(event_id)) {
            navigate(`/events/edit/${event_id}`)

        } else {
            navigate(`/events/${event_id}`);
        }

    };

    const getAllSubEvents = async () => {
        setIsLoading(true);
        try {
            const {data} = await ApiClient.get('/event/children', {params: {id: event?.id}});
            console.log('child events are ', data);
            if (data?.success) {
                setChildrenEvents(data?.data);
            } else {
                toast.error("Failed to get the sub events");
            }
        } catch (e) {
            toast.error(e.message);

        }
        setIsLoading(false);


    }

    const RenderEventIcon=(event_level)=>{
        if(event_level?.toLowerCase()==='parent'){
            return <span className={"event-details-primary-icon-container"}><PrimaryEventIcon/></span>
        }
        else if(event_level?.toLowerCase()==='intermediate'){
            return <span className={"event-details-intermediate-icon-container"}><IntermediateEventIcon/></span>
        }else{
            return  <span className={"event-details-leaf-icon-container"}><LeafEventIcon/></span>
        }

    }

    useEffect(() => {
        if (showChildrenEvents) {
            getAllSubEvents();
        }

    }, [showChildrenEvents]);
    return (
        <div>
            <div style={{display: "flex"}}>
                {String(id) !== String(event?.id)&& event?.event_level?.toLowerCase()!=='leaf' && <IconButton onClick={() => {
                    setShowChildrenEvents(!showChildrenEvents)
                }}>{!showChildrenEvents ? <ExpandMoreIcon/> : <ExpandLessIcon/>}</IconButton>}
                <div
                    className="event-details-child-list-card"
                    onClick={() => submissionHandler(event?.id, event?.event_level)}
                >
                    <div className="event-details-list-first-part">
                        <img
                            className="event-photo"
                            src={event?.image_url ? event?.image_url : ImageNotFound}
                        />
                    </div>
                    <div className="event-details-list-sec-part">
                        <div className="list-name">
                            <div className="green-line"></div>
                            <div className="level-event-container">
                                <div>
                                    <span style={{color: " #66666699"}}>Level : </span>
                                    <span style={{color: "#FF9559"}}>{event?.data_level}</span>
                                </div>

                                <div className="heading">
                                    {event?.name}

                                </div>
                            </div>
                        </div>

                        <div className="event-details-child-date-time-location-container">
                            <div className="date-time-location-inner-container">
                                <CalenderIcon className="svg-icon"/>
                                <span>
              {moment(event?.start_date).format("DD MMMM YYYY")} -
                                    {moment(event?.end_date).format("Do MMMM YYYY")}
            </span>
                            </div>
                            <div className="date-time-location-inner-container">
                                <ClockIcon className="svg-icon"/>
                                <span>
              {moment(event?.start_datetime, "YY-MM-DD hh:mm:ss A").format(
                  "hh:mm a"
              )}
                                    -
                                    {moment(event?.end_datetime, "YY-MM-DD hh:mm:ss A").format(
                                        "hh:mm a"
                                    )}
            </span>
                            </div>
                            <div className="date-time-location-inner-container">
                                <LocationIcon className="svg-icon"/>
                                <span>{event?.states}</span>
                            </div>
                        </div>
                    </div>

                    <div className="event-details-list-third-part">
                        <div className={`${event?.status?.class_name} active-button-style`} >
                            <span>{event?.status?.name}</span>
                        </div>
                        <div>{RenderEventIcon(event?.event_level)}</div>

                    </div>
                </div>
            </div>
            <div style={{marginLeft: "20px"}}>
                {isLoading ?  <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                    : (showChildrenEvents && childrenEvents?.length === 0) ? <span>No sub event found</span>:
                        (showChildrenEvents&&childrenEvents?.length > 0) ? <div className={"sub-events-container"}> {childrenEvents?.map((item,index) =>
                            <EventChildCard key={index} event={item}/>)    } </div> : <></>
                }

            </div>
        </div>
    )
        ;
};

export default EventChildCard;
