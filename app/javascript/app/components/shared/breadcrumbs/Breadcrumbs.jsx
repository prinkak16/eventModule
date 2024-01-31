import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation} from "react-router";
import {Link, useParams} from "react-router-dom";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import './breadcrumbs.scss'
import {IntermediateEventIcon, LeafEventIcon, PrimaryEventIcon} from "../../../assests/svg";

export default function MyBreadcrumbs() {

    const {id} = useParams();
    const {pathname} = useLocation();
    const [dynamicRoutes, setDynamicRoutes] = useState({});
    let urls = pathname?.split("/").filter(Boolean);


    function isNumeric(input) {
        return /^\d+$/.test(input);
    }

    if (isNumeric(urls[urls.length - 1])) {
        urls = urls.slice(0, urls.length - 1);
    }


    const breadcrumbsNames = {
        events: "Events",
        create: "Create Event",
        edit: "Edit Event",
        view: "View Event "
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
        const {data} = await ApiClient.get(`event/path`, {params: {id}})
        setDynamicRoutes(data?.data);

    }

    useEffect(() => {
        getDynamicRoutes();
    }, [pathname]);

    return (
        <div className={"breadcrumbs-main-container"}>
            {urls?.length > 0 && <Link to={`/${urls[0]}`}>{urls[0]}</Link>}
            {Object.keys(dynamicRoutes).length > 0 && <span> &nbsp;/&nbsp; </span>}
            {Object.keys(dynamicRoutes)?.map((key, index) => <span key={index} style={{display: "flex"}}>
         <Link to={`/${urls[0]}/${key}`}>
           <span style={{display: "flex", gap: "10px"}}> {RenderEventIcon(dynamicRoutes[key][1])}
               {dynamicRoutes[key][0]}</span>
         </Link>
                    {index < Object.keys(dynamicRoutes).length - 1 && <span> &nbsp;/&nbsp; </span>}
      </span>
            )}
            {/*{urls?.map((url, index) => (
        <span key={index}>
          <Link
            style={{
              color: index === urls.length - 1 ? "#000000D9" : "#000000A6",
            }}
            to={`/${urls.slice(0, index + 1).join("/")}`}
          >
            {breadcrumbsNames[url]??url}
          </Link>
          {index < urls.length - 1  && <span> &nbsp;/&nbsp; </span>}
        </span>
      ))}*/}
            {urls.length > 1 && <span> &nbsp;/&nbsp; </span>}
            {urls.length > 1 && <Link
                style={{
                    color: "black"
                }}
            >
                {urls[urls.length - 1]}
            </Link>}
        </div>
    );
}
