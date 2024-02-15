import React from 'react'
import './form-event-mobile-horizontal.css'
import {DefaultImage} from '../../../../assests/png/index'
import PlaceIcon from '@mui/icons-material/Place';
import moment from "moment";
import EllipsesComponent from "../../../../utils/EllipsesComponent";
import {useNavigate} from "react-router";

const FormEventMobileCardHorizontal = ({event, index}) => {

    const navigate = useNavigate();

    const submissionHandler = (event_id) => {
        // navigate(`/forms/${event_id}`);
        window.location.href=`${window.location.href}/${event_id}`;
    };

    return (
            <div className="form-event-container-horizontal" onClick={()=>submissionHandler(event?.id)}>
                <div className="bg-img-container">
                    <img src={event?.image_url ? event?.image_url : DefaultImage} alt="loading..." className="bg-img"/>
                    <div className="event-details-container">
                        <EllipsesComponent text={event?.name}/>
                    </div>
                </div>
            </div>
    )
}

export default FormEventMobileCardHorizontal;