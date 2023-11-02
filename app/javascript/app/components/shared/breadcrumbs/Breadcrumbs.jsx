import * as React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function MyBreadcrumbs() {
  const { pathname } = useLocation();
  const urls = pathname?.split("/").filter(Boolean);

  

  
  const breadcrumbsNames = {
    events: "Events",
    create_event: "Create Event",
    edit_event: "Edit Event",
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
            {breadcrumbsNames[url]}
          </Link>
          {index < urls.length - 1 && <span> &nbsp;/&nbsp; </span>}
        </span>
      ))}
    </div>
  );
}
