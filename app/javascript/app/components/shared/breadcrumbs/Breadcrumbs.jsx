import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation} from "react-router";
import {Link, useParams} from "react-router-dom";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import './breadcrumbs.scss'
import {IntermediateEventIcon, LeafEventIcon, PrimaryEventIcon} from "../../../assests/svg";
import {EventState} from "../../../context/EventContext";

export default function MyBreadcrumbs() {

    const {id} = useParams();
    const {pathname} = useLocation();
    const [dynamicRoutes, setDynamicRoutes] = useState({});
    let urls = pathname?.split("/").filter(Boolean);
    const {globalSelectedLanguage} = EventState();

    //function to check whether url contains number in the end
    function isNumeric(input) {
        return /^\d+$/.test(input);
    }
    if (isNumeric(urls[urls.length - 1])) {
        //don't want number in the breadcrumbs
        urls = urls.slice(0, urls.length - 1);
    }
    // clear browser history stack
    const clearHistoryStack = (event,entriesToClear) => {
        event.preventDefault();
        window.history.go(-entriesToClear)     //number of steps to go back in browser
    };

    const RenderEventIcon = (event_level) => {
        if (event_level?.toLowerCase() === 'parent') {
            return <span className={"event-details-primary-icon-container"}><PrimaryEventIcon/></span>
        } else if (event_level?.toLowerCase() === 'intermediate') {
            return <span className={"event-details-intermediate-icon-container"}><IntermediateEventIcon/></span>
        } else {
            return <span className={"event-details-leaf-icon-container"}><LeafEventIcon/></span>
        }

    }
    const getDynamicRoutes = async () => {
        if (id) {
            try {
                const {data} = await ApiClient.get(`event/path`, {params: {id, language_code: globalSelectedLanguage}})
                setDynamicRoutes(data?.data);
            } catch (e) {
                console.log(e?.message);
            }

        }


    }

    function capitalizeFirstWord(inputString) {
        return inputString.replace(/^\w/, (match) => match.toUpperCase());
    }

    useEffect(() => {
        getDynamicRoutes();
    }, [pathname,globalSelectedLanguage]);

    return (
        <div className={"breadcrumbs-main-container"}>
            {urls?.length > 0 && <Link onClick={(e)=>clearHistoryStack(e,Object.keys(dynamicRoutes)?.length)}>{capitalizeFirstWord(urls[0]==='forms'?'events':urls[0])}</Link>}
            {Object.keys(dynamicRoutes).length > 0 && <span> &nbsp;/&nbsp; </span>}      {/* if dynamic routes exist add '/' before adding them*/}
            {Object.keys(dynamicRoutes)?.map((key, index) => <span key={index} style={{display: "flex"}}>
         <Link   onClick={(e)=>clearHistoryStack(e,Object.keys(dynamicRoutes)?.length-(index+1))}>
           <span style={{display: "flex", gap: "6px"}}> {RenderEventIcon(dynamicRoutes[key][1])}
               {capitalizeFirstWord(dynamicRoutes[key][0])}</span>
         </Link>
                {index < Object.keys(dynamicRoutes).length - 1 && <span> &nbsp;/&nbsp; </span>}
      </span>)}
            {urls.length > 1 && <span> &nbsp;/&nbsp; </span>}
            {urls.length > 1 && <Link
                style={{
                    color: "black"
                }}
            >
                {urls[urls.length - 1]}
            </Link>}        {/*these paths are from url */}
        </div>);
}
