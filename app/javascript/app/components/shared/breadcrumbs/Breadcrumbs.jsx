import * as React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function MyBreadcrumbs() {
  const { pathname } = useLocation();
  let urls = pathname?.split("/").filter(Boolean);
  

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

  return (
    <div>
      {urls?.map((url, index) => (
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
      ))}
    </div>
  );
}
