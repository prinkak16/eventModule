import React, {useEffect, useState} from "react";
import "./event-child-card.scss";
import {
    CalenderIcon,
    ClockIcon,
    IntermediateEventIcon,
    LeafEventIcon,
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
import EllipsesComponent from "../../../../../../utils/EllipsesComponent";


const EventChildCard = ({event}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [childrenEvents, setChildrenEvents] = useState([]);
    const [showChildrenEvents, setShowChildrenEvents] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (showChildrenEvents) {
            getAllSubEvents();
        }
    }, [showChildrenEvents]);

    useEffect(() => {
        return ()=>{
                setShowChildrenEvents(false);
        }
    }, [id]);
    const submissionHandler = (event_id, event_level) => {

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

    const RenderEventIcon = (event_level) => {
        if (event_level?.toLowerCase() === 'parent') {
            return <span className={"event-details-primary-icon-container"}><PrimaryEventIcon/></span>
        } else if (event_level?.toLowerCase() === 'intermediate') {
            return <span className={"event-details-intermediate-icon-container"}><IntermediateEventIcon/></span>
        } else {
            return <span className={"event-details-leaf-icon-container"}><LeafEventIcon/></span>
        }

    }



    return (

        <div style={{marginLeft: "36px"}}>
            <div style={{display: "flex"}}>
                {event?.event_level?.toLowerCase() !== 'leaf' &&
                    <IconButton style={{
                        width: "40px", height: "40px"
                    }} onClick={() => {
                        setShowChildrenEvents(!showChildrenEvents)
                    }}>
                        {!showChildrenEvents ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                    </IconButton>}
                <div
                    className="event-details-child-list-card"
                    onClick={() => submissionHandler(event?.id, event?.event_level)}
                    style={{marginLeft: event?.event_level?.toLowerCase() !== 'leaf' ? "0px" : "40px"}}
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
                                    <EllipsesComponent text=
                                                           {event?.name}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="event-details-child-date-time-location-container">
                            <div className="date-time-location-inner-container">
                                <span className={"title-style"}>START DATE & TIME
                            </span>
                            <span>
              {moment(event?.start_date).format("DD MMMM YYYY")}, {moment(event?.start_datetime, "YY-MM-DD hh:mm:ss A").format(
                                "hh:mm a"
                            )}
            </span>
                        </div>
                            <div className="date-time-location-inner-container">
                                <span className={"title-style"}>END DATE & TIME</span>
                                <span>
                            {moment(event?.end_date).format("Do MMMM YYYY")}, {moment(event?.start_datetime, "YY-MM-DD hh:mm:ss A").format(
                                    "hh:mm a"
                                )}
            </span>
                            </div>
                            <div className="date-time-location-inner-container">
                                <span className={"title-style"}>LOCATION</span>
                                <span>
                     {event?.states}
            </span>
                            </div>
                        </div>
                    </div>

                    <div className="event-details-list-third-part">
                    <div className={`${event?.status?.class_name} active-button-style`}>
                            <span>{event?.status?.name}</span>
                        </div>
                        <div>{RenderEventIcon(event?.event_level)}</div>

                    </div>

                </div>
            </div>
            <div>
                {isLoading ? <Box className={"sub-event-loader"}>
                        <CircularProgress/>
                    </Box>
                    : (showChildrenEvents && childrenEvents?.length === 0) ?
                        <span className={"no-event-found"}>No sub event found</span> :
                        (showChildrenEvents && childrenEvents?.length > 0) ?
                            <div className={"sub-events-container"}> {childrenEvents?.map((item, index) =>
                                <EventChildCard key={index} event={item}/>)} </div> : <></>
                }

            </div>
        </div>
    )
        ;
};

export default EventChildCard;
