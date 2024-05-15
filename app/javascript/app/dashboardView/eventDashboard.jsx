import React, {useState, useEffect} from "react"
import Header from "./shared/header/header";
import {Grid, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import "./eventDashboad.scss"
import CommonHeading from "./shared/commonHeading/commonHeading";
import EventCards from "./shared/eventCards/eventCards";
import UserCards from "./shared/usersCard/userCards";
import {getReports} from "../services/CommonServices/commonServices";
import MapData from "./shared/map/map";
import SharedSlider from "./shared/sharedSlider/sharedSlider";
import SharedTable from "./shared/sharedTable/sharedTable";
export default function EventDashboard(){
    const [reportingData, setReportingData] = useState([])
    const getUserData = ()=>{
        getReports().then(data => setReportingData(data.data))
    }

    useEffect(() => {
        getUserData()
    }, []);
    return(
        <>
            <Header/>
            <Box component="section" sx={{ p: 6}}>
                <Grid md={12} item className="main-heading d-flex justify-content-between align-items-center">
                    <Typography variant="h3">Events Dashboard</Typography>
                    <Typography variant="p">Last Update: 12:00:32pm, 1-Apr-2024</Typography>
                </Grid>
                <Grid container>
                    <Grid item md={8} className="event-card-wrap" >
                       <CommonHeading sharedHeading="Events"/>
                        <div className="d-flex justify-content-between mt-3">
                            <EventCards/>
                        </div>
                    </Grid>
                    <Grid item md={2}>
                        <UserCards cardTitle="Total Reportings" reportCount={reportingData.totalReportings}/>
                    </Grid>
                    <Grid item md={2}>
                        <UserCards cardTitle="Unique Users" reportCount={reportingData.uniqueUsers}/>
                    </Grid>
                    <Grid  item md={6} className="mt-4">
                        <MapData/>
                    </Grid>
                    <Grid  item md={6} className="mt-4">

                    </Grid>
                    <Grid  item md={12} className="mt-4">
                            <CommonHeading sharedHeading="Recent Contributors" className="my-3"/>
                            <SharedSlider/>
                    </Grid>
                    <Grid  item md={12} className="mt-4">
                            <SharedTable/>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}
