import React, {useEffect, useRef, useState} from "react";
import "./form.module.scss";

import {Box, Pagination, TextField} from "@mui/material";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FormEventMobileCard from "./mobile_view/FormEventMobileCard";


import {ApiClient} from "../../../services/RestServices/BaseRestServices";
import FormEventCard from "./FormEventCard";
import {EventState} from "../../../EventContext";

import ReactLoader from "../../shared/loader/Loader";
import {useTranslation} from "react-i18next";

const FormComponent = () => {
    const {t}=useTranslation();

    const imgDefault =
        "https://storage.googleapis.com/public-saral/public_document/upload-img.jpg";
    const nextBtn =
        "https://storage.googleapis.com/public-saral/public_document/button.png";
    const navigate = useNavigate();
    const [allEventList, setAllEventList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [loader, setLoader] = useState(false);
    const [searchEventName, setSearchEventName] = useState(null);
    const rowsPerPage = 10;
    const myRef = useRef(null);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [isEventChanged, setIsEventChanged] = useState(false);
    const {setIsSubmissionPage, setEventName,globalSelectedLanguage} = EventState();

    async function getEventsList() {
        setLoader(true)

        const params = {
            search_query: searchEventName ?? "",
            limit: rowsPerPage,
            offset: rowsPerPage * (page - 1),
            language_code:globalSelectedLanguage
        };

        try {
            let {data} = await ApiClient.get("/event/event_user_list", {
                params: params,
            });
            if (data.success) {
                setAllEventList(data.data);
                setTotalCount(data?.total ?? data?.data?.length);
                setLoader(false)
                window.scrollTo({top: 0});

            } else {
                setLoader(false)
                toast.error(`Failed to get event list`);
            }
        } catch (error) {
            setLoader(false)
            toast.error("Failed to get event list");
        }
        setIsEventChanged(false)

    }


    const handlePageChange = (e, newPage) => {
        setPage(newPage);
    };


    useEffect(() => {
        getEventsList();
    }, [page,globalSelectedLanguage]);

    //useEffect related to context api
    useEffect(() => {
        setEventName(null);
        setIsSubmissionPage(false);
    }, []);


    //debouncing for search filter
    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            if (searchEventName !== null) {
                if (page === 1) {
                    getEventsList()
                } else {
                    setPage(1)
                }
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
        <Box className="form-main-container" ref={myRef}>
            {loader ? <ReactLoader/> :
                <>

                    <div className="form-event-search">
                        <TextField
                            className="search-input"
                            sx={{margin: "30px", width: "80%"}}
                            placeholder={t("Search")}
                            variant="outlined"
                            value={searchEventName}
                            onChange={(e) => {
                                setSearchEventName(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
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
                </>
            }

        </Box>

    );
};

export default FormComponent;