import React, { useEffect, useState } from "react";
import "./form.module.scss";

import {Autocomplete, Box, Pagination, Paper, TextField} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faArchive, faEye } from "@fortawesome/free-solid-svg-icons";
import Loader from "react-js-loader";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {useRef} from "react";
import FormEventMobileCard from "./mobile_view/FormEventMobileCard";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { ApiClient } from "../../../services/RestServices/BaseRestServices";
import FormEventCard from "./FormEventCard";
import {EventState} from "../../../EventContext";
// import { DefaultImage } from "../../../assests/png";
import EllipsesComponent from "../../../utils/EllipsesComponent";
const FormComponent = () => {
  const imgDefault =
    "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
  const nextBtn =
    "https://storage.googleapis.com/public-saral/public_document/button.png";
  const navigate = useNavigate();
  const [allEventList, setAllEventList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [loader, setLoader] = useState(false);
  const [searchEventName, setSearchEventName] = useState("");
  const rowsPerPage = 10;
  const myRef=useRef(null);
  const [innerWidth,setInnerWidth]          =useState(window.innerWidth);
  const [isEventChanged,setIsEventChanged]=useState(false);
   const {setIsSubmissionPage,setEventName}=EventState();

  async function getEventsList() {
    setLoader(true)
    
    const params = {
      search_query: searchEventName,
      limit: rowsPerPage,
      offset: rowsPerPage * (page - 1),
    };

    try {
      let { data } = await ApiClient.get("/event/event_user_list", {
        params: params,
      });
      if (data.success) {
        setAllEventList(data.data);
        setTotalCount(data?.total ?? data?.data?.length);
        setLoader(false)
      } else {
        setLoader(false)
        toast.error(`Please enter ${data.message}`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      setLoader(false)
      toast.error("Failed to get event list", { autoClose: 2000 });
    }
    setIsEventChanged(false)

  }

  useEffect(() => {
    getEventsList();
  }, [page]);

  useEffect(() => {
    setEventName(null);
    setIsSubmissionPage(false);
  }, []);
 
  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      console.log('reached here')
      if (page===1){
        getEventsList()
      }   else{
        setPage(1)

      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchEventName]);



  const handleResize = () => {
    setInnerWidth(window.innerWidth)

  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 /* useEffect(() => {
    console.log('inner width is ',innerWidth)
  }, [innerWidth]);*/
  return (
    <Box className="form-main-container" ref={myRef} component={innerWidth>450? Paper:""}>
      {loader ? (
        <Loader
          type="bubble-ping"
          bgColor={"#FFFFFF"}
          title="Loading.."
          color={"#FFFFFF"}
          size={100}
        />
      ) : (
        <></>
      )}

      
        
      <div>
      </div>
        <div className="form-event-search">
          <TextField
              className="search-input"
              sx={{ margin: "30px", width: "80%" }}
              placeholder="Search"
              variant="outlined"
              value={searchEventName}
              onChange={(e) => {
                setSearchEventName(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                ),
              }}
          />
        </div>

        <div className="form-events-container">
          {allEventList.length > 0 ? (
              <div className="form-list-container">
                {allEventList.map((event, index) => {
                      if (innerWidth > 450) {
                        return <FormEventCard event={event} key={index}/>
                      } else {
                        return <FormEventMobileCard event={event} key={index}/>
                      }
                    }
                )}
              </div>
          ) : (
              <div className="no-event-data">No Data Found</div>
          )}
        </div>
        <div className="pagination">
          <Pagination
              count={Math.ceil(totalCount / 10)}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
          />
        </div>

    </Box>

  );
};

export default FormComponent;