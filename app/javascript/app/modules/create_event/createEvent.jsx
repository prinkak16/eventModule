import React from 'react';
import './createEvent.scss';
import {
    Autocomplete, Box, Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel, MenuItem, Modal,
    Radio,
    RadioGroup, Select,
    TextField, Typography
} from "@mui/material";
import dayjs, {Dayjs} from 'dayjs';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';


export default function CreateEvent() {
    const levels = [{label: "Pradesh"}, {label: "Vibhag"}, {label: "Lok Sabha"}, {label: "Zila"}, {label: "Vidhan Sabha"}, {label: "MAndal"}, {label: "Shakti Kendra"}, {label: "booth"}]
    const [open, setOpen] = React.useState(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <div className="container">
                <h3 className="font-weight-300">Create an Event</h3>
                <div className="event-create-form-bg">
                    <TextField id="outlined-basic" label="Event title" variant="outlined" className="w-100"/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                            <div className="d-flex justify-content-between">
                                <DateTimePicker
                                    label="Start date & Time *"
                                    className="w-49"
                                />
                                <DateTimePicker
                                    label="End date & Time *"
                                    className="w-49"
                                />
                            </div>
                        </DemoContainer>
                    </LocalizationProvider>
                    <p>Upload Image/ Banner:</p>
                    <div>
                        <input type="file" className="file-input"/>
                    </div>
                    <div>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={levels}
                            className="w-100"
                            renderInput={(params) => <TextField {...params} label="Select levels"/>}
                        />
                    </div>
                    <div className="mt-2">
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={levels}
                            className="w-100"
                            renderInput={(params) => <TextField {...params} label="Select Location"/>}
                        />
                    </div>
                    <div className="mt-2">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Reporting Target</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="open_event" control={<Radio />} label="Open event" />
                                <FormControlLabel value="csv_upload" onClick={handleOpen} control={<Radio />} label="CSV Upload" />
                                <FormControlLabel value="user_segmentation" control={<Radio />} label="User Segmenatation" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Upload CSV
                                <hr/>
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                               <div>
                                   <div>
                                       You can download sample file here.
                                   </div>
                                   <div>
                                       You can drag & drop and csv file here.
                                   </div>
                               </div>
                            </Typography>
                        </Box>
                    </Modal>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    )
}
