import React, {useEffect, useState} from "react";
import {Chip, Pagination} from "@mui/material";
import "./view-csv.scss"
import CsvModal from "../../../modals/CsvUploadModal";
import {EventState} from "../../../../context/EventContext";
import {
    getEventCsvData,
    getLatestCsvUploads,
    postEventCsvData
} from "../../../../services/CommonServices/commonServices";
import {toast} from "react-toastify";
import {useParams} from "react-router";
import moment from "moment";

const eventLevels = [{"pradesh": 1}, {"vibhag": 1}, {"Lok Sabha": 1}, {"Zila": 1}, {"Vidhan Sabha": 1}, {"Mandal": 1}, {"Shakti Kendara": 1}, {"Booth": 2}, {"Total count": 100}];
const tableHeader = ["S. No.", "Phone No.", "State", "Location Type", "Location Name/No.", "Location Filter"]
const tableBody = [[1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134-asdf f Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"], [1, 9876543210, "Rajsthan", "Booth", "2134- Booth ABC", "zila"]]
const ViewCsv = () => {
    const {id} = useParams();
    const rowPerPage = 10;
    const [page, setPage] = useState(1);
    const [EventLevels, setEventLevels] = useState(eventLevels);
    const [recentlyUploadedFiles,setRecentlyUploadedFiles]=useState([]);
    const [searchQuery, setSearchQuery] = useState(null);
    const {setShowCsvModal} = EventState();
    useEffect(() => {
        fetchCsvData();
    }, [page]);
    useEffect(() => {
        fetchLatestCsvUploads();
    }, [])
    useEffect(() => {
        let timer;
        timer = setTimeout(() => {
            if (searchQuery !== null) {
                if (page === 1) {
                    fetchCsvData();
                } else {
                    setPage(1)
                }
            }
        }, 1500);
        return () => {
            clearTimeout(timer);
        };
    }, [searchQuery]);
    const fetchCsvData = async () => {
        const queryParams = {event_id: id,searchQuery, offset: (page - 1) * rowPerPage, limit: rowPerPage}
        try {
            const {data} = await getEventCsvData(queryParams);
            console.log('data ', data);
        } catch (e) {
            toast.error(e?.message)
        }
    }
    const fetchLatestCsvUploads = async () => {
        try {
            const {data} = await getLatestCsvUploads();
           if(data?.success){
               setRecentlyUploadedFiles(data?.data);
           }else{
               toast.error(data?.message);
           }
        } catch (e) {
            toast.error(e?.message);
        }
    }
    const uploadCsvDetails=async (body)=>{
        const csvDataDetails=new FormData();
        csvDataDetails.append('email',body?.email);
        csvDataDetails.append('csv_file',body?.csvFile);
        csvDataDetails.append('event_id',body?.id);
        try {
            const {data}=await postEventCsvData(csvDataDetails);
            console.log('data is ',data);
        }catch (e) {
            toast.error(e?.message);
        }
    }
    const handlePageChange = (e, newPage) => {
        setPage(newPage);
    }

    return (
        <div className={"view-csv-main-container"}>
            <CsvModal  uploadCsv={uploadCsvDetails}/>
            <div className={"recent-file-and-button-container"}>
                <div htmlFor={"cars"}>
                    <label htmlFor="cars">Show</label>
                    <select name="cars" id="cars" className={"recent-files-dropdown-container"}>
                        <option disabled selected value="default">Recent Files</option>
                        {recentlyUploadedFiles?.map((item) => <option value={`${item?.file_name} ${item?.date}`}>{`${item?.file_name} ${moment(item?.date).format("DD MMM YYYY, hh:mm A")}`}</option>
                        )}
                    </select>
                </div>

                <button className={"csv-button"} onClick={() => setShowCsvModal(true)}>Add / Delete Reportees</button>
            </div>
            <div className={"level-filer-container"}>
                {EventLevels?.map((level) => Object.entries(level).map(([key, value]) => <Chip
                    label={`${key} ${value}`}
                    className={`level-filter-chip ${key.toLowerCase()==='total count'?'highlighted-chip':''}`}
                />))
                }
            </div>
            <div className={'search-bar-container'}>
                <h2>CSV List</h2>
                <input placeholder={"Search by phone number"} className={"search-bar"} type={"tel"}
                       onChange={(e) => setSearchQuery(e?.target?.value)}/>
            </div>
            <div className={"table-container"}>
                <table>
                    <tr className={`table-header`}>
                        {tableHeader?.map((header) => <th>{header}</th>)}
                    </tr>
                    {tableBody?.map((tablerow) => <tr>
                        {tablerow?.map(data => <td>{data}</td>)}
                    </tr>)}

                </table>
                <Pagination count={10} variant="outlined" shape="rounded" className={"pagination-item"} colSpan={3}
                            page={page}
                            onChange={handlePageChange}
                />
            </div>
        </div>
    )
}
export default ViewCsv;
