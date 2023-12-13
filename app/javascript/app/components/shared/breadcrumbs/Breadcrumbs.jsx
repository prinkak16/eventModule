import * as React from "react";
import { useLocation } from "react-router";
import {Link, useParams} from "react-router-dom";
import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import {useEffect,useState} from "react";

export default function MyBreadcrumbs() {

  const {id}=useParams();
  const { pathname } = useLocation();
  const [dynamicRoutes,setDynamicRoutes]=useState({});
  let urls = pathname?.split("/").filter(Boolean);
/*
  const indexOfEvent=urls('events');
*/


  function isNumeric(input) {
    return /^\d+$/.test(input);
  }

  if(isNumeric(urls[urls.length-1])){
    urls=urls.slice(0,urls.length-1);
  }
  
  
  
  const breadcrumbsNames = {
    events: "Events",
    create: "Create Event",
    edit: "Edit Event",
    view: "View Event "
  };

  const getDynamicRoutes=async ()=>{
    const {data}=await ApiClient.get(`event/path`,{params:{id}})
    setDynamicRoutes(data?.data);

    for(let key in data?.data){
      console.log('key is ',key, 'and vlaue is ',data?.data[key]) ;
    }
    
  }

  useEffect(() => {
    getDynamicRoutes();
  }, [pathname]);

  console.log('urls of breadcurmbs is ',urls);
  return (
    <div>
      <Link to={"/events"}>Events / </Link>
      {Object.keys(dynamicRoutes)?.map((key,index)=> <span>
         <Link to={`/events/${key}`}>{dynamicRoutes[key]}</Link>
            {index < Object.keys(dynamicRoutes).length - 1  && <span> &nbsp;/&nbsp; </span>}
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
      {urls.length>1&& <Link
          style={{
            color:"black"
          }}
      >
        {urls[urls.length-1]}
      </Link>}
    </div>
  );
}
