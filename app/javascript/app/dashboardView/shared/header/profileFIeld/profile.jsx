import React from "react"
import ProIcon from "../../../../assests/svg/BJP-logo.svg";
import "./profile.scss"
import {ArrowDropDownSharp} from "@mui/icons-material";

export default function ProfileFIeld() {
    return(
        <>
            <div className="d-flex align-items-center">
                <div className="profile">
                    <span><ProIcon/></span>
                    <div>
                        <h6>Priyanka</h6>
                        <p>Level</p>
                    </div>
                </div>
                <ArrowDropDownSharp className="dropdown-icon"/>
            </div>
        </>
    )
}