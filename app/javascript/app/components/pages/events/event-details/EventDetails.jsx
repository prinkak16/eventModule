import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {ApiClient} from "../../../../services/RestServices/BaseRestServices";
import EventDetailsCard from './event-details-card/parent-card-view/EventDetailsCard'
import EventChildCard from '../event-details/event-details-card/child-card-view/EventChildCard'
import {Button} from "@mui/material";
import {useLocation} from "react-router";
import './event-details.scss'
import {toast} from "react-toastify";

const EventDetails = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [parentEvent, setParentEvent] = useState({});
    const [childEvents, setChildEVents] = useState([]);
    const [isChildEvent, setIsChildEvent] = useState(false)

    const {id} = useParams();

    const getEventDetails = async () => {
        try {
            const {data} = await ApiClient.get('event/event_data', {params: {id}})
            if (data?.success) {
                setParentEvent(data?.data)
                setChildEVents(data?.child_data);
                setIsChildEvent(data?.is_child);
                window.scrollTo({top: 0});
            } else {
                toast.error("Failed to get events details")
            }


        } catch (e) {
            toast.error(e?.message);

        }


    }

    useEffect(() => {
        getEventDetails();
    }, [pathname]);

    const handleClick = (event_action) => {
        if (event_action === 'create_event') {
            navigate(`/events/create/${id}`);
        } else {
            window.location.href = parentEvent?.create_form_url;
        }
    }

    return (
        <div className={"event-details-main-container"}>
            <div className={"heading"}>Event Details</div>
            <EventDetailsCard event={parentEvent}/>
            {parentEvent?.has_sub_event && <>
                {parentEvent?.status?.name?.toLowerCase() !== 'expired' &&
                    <div className={"add-event-button-container"}>
                        <Button onClick={() => handleClick('create_event')} className={"add-event-button"}
                                variant={"contained"}>+ Add Sub Event</Button>
                    </div>}

                <div className={"heading"}>Sub Events</div>
                <div>{childEvents?.length === 0 &&
                    <h5 className={"no-sub-event-style"}>No sub event is created yet</h5>}</div>
                <div>{childEvents?.length > 0 && childEvents?.map((childEvent, index) => <EventChildCard
                    event={childEvent} key={index}/>)}</div>
            </>
            }
            {!parentEvent?.has_sub_event && <>
                {parentEvent?.status?.name?.toLowerCase() !== 'expired' &&
                    <div className={"add-event-button-container"}>
                        <Button onClick={() => handleClick('go_to_form')} className={"add-event-button"}
                                variant={"contained"}>Go to form</Button>
                    </div>
                }
                <div className={"heading"}>Form View</div>
                <div className={"iframe-container"}>
                    <iframe src={parentEvent?.preview_url} height="700px" width="100%" title="Iframe Example"/>
                </div>
            </>
            }

        </div>
    )
}

export default EventDetails;