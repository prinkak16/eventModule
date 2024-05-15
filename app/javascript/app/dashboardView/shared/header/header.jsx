import React from "react"
import {Link} from "react-router-dom";
import {Grid, Box} from '@mui/material';
import SelectField from "../sharedSelect/selectField";
import SharedButton from "../sharedButton/Button";
import SaralLogo from "../../../assests/svg/sarallogo.svg"
import PhoneIcon from "../../../assests/svg/phoneIcon.svg"
import "./header.scss"
import ProfileFIeld from "./profileFIeld/profile";
export default function Header(){
    return(
        <>
            <Box component="section" sx={{ px: 5, py:2}} className="header">

                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Link to='/' className='header-left-part'>
                                <SaralLogo/>
                                <span className='bjp-text ms-4'>भारतीय जनता पार्टी</span>
                            </Link>
                        </Grid>
                        <Grid item xs={8} className="d-flex justify-content-end align-items-center">
                                <Grid item xs={2}>
                                    <SelectField/>
                                </Grid>
                                <Grid className="mx-4">
                                    <SharedButton buttonText={<PhoneIcon/>}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <ProfileFIeld/>
                                </Grid>
                        </Grid>
                    </Grid>
            </Box>
        </>
    )
}