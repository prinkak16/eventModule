import React from 'react'
import './form-event-mobile-horizontal.css'
import {DefaultImage} from '../../../../assests/png/index'
import PlaceIcon from '@mui/icons-material/Place';
import moment from "moment";
import EllipsesComponent from "../../../../utils/EllipsesComponent";
import {useNavigate} from "react-router";

const FormEventMobileCardHorizontal=({event,index})=>{

    const navigate=useNavigate();

    const submissionHandler = (event_id) => {
        navigate(`/forms/${event_id}`);
    };

    return(
        <div className="form-event-container-horizontal" onClick={()=>submissionHandler(event?.id)}>
            <div className="bg-img-container">
                <img src={event?.image_url ? event?.image_url : DefaultImage} alt="loading..." className="bg-img"/>
                <div className="event-details-container">
                    <EllipsesComponent text={event?.name}/>
                    <div className="flex-details">
                            <EllipsesComponent text={moment(event?.start_date).format("DD MMM YY")}
                            />
                            <EllipsesComponent
                                text={moment(event?.start_datetime, "YY-MM-DD hh:mm:ss A").format('h:mm a')}
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormEventMobileCardHorizontal;