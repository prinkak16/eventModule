import React, {useState, useEffect} from "react";
import {CardContent, Grid} from "@mui/material";
import {CalendarIcon} from "@mui/x-date-pickers";
import Typography from "@mui/material/Typography";
import "./eventCards.scss"
import {getEventCards} from "../../../services/CommonServices/commonServices";

export default function EventCards() {
    const [events, setEvents] = useState(null)
        const getEventDetails = () => {
            getEventCards().then(data => {
                setEvents(Object.values(data.data)[0])
            })
        }

        useEffect(() => {
            getEventDetails();
        }, []);

    const CardView = ({title, count}) => {
        return (
            <>
                <Grid container className="cardevent mx-3">
                    <Grid item xs={10}>
                        <h5>{title}</h5>
                        <Typography variant="p">{count}</Typography>
                    </Grid>
                    <Grid item xs={2} className="text-center">
                        <span className="calendar-icon" ><CalendarIcon/></span>
                    </Grid>
                </Grid>
            </>
        )
    }

    return(
        <>
            {events && (
                <>
                    <CardView title="Total Events" count={events.totalEvents} />
                    <CardView title="Total Active Events" count={events.totalActiveEvents} />
                    <CardView title="Total Completed Events" count={events.totalCompletedEvents} />
                </>
            )}
        </>
    )
}