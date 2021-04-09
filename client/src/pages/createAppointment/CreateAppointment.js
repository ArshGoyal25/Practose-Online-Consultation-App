import 'date-fns';
import React, { Fragment, useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import DateFnsUtils from '@date-io/date-fns';
import client from '../../utils/axios/client';
import { connect } from 'react-redux';
import Loading from '../../components/Layout/Loading';

import {
    Card, CardHeader, Container, CardContent,
    Typography, Button, CardActions,
    Grid, TextField, Checkbox, FormControlLabel,
    InputAdornment, IconButton, FormControl,
    InputLabel, Input, Chip, Avatar, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers';
import {
    Autocomplete, Rating
} from '@material-ui/lab';

import {showAlert} from '../../utils/alert/Alert';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import './createAppointment.css';

const CreateAppointment = (props) => {
    const [appointment, setAppointment] = useState({
        isRoutine: false,
        symptoms: [],
        appointmentDate: null,
        appointmentTime: null,
    })
    const [currentSymptom, setCurrentSymptom] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    useEffect(() => {
        client.post('/user/doctors')
        .then(res => {
            setLoading(false);
            setDoctors(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);


    const handleDeleteSymptom = (symptom) => {
        const updatedAppointment = {...appointment};
        updatedAppointment.symptoms = appointment.symptoms.filter(x => x !== symptom);
        setAppointment(updatedAppointment);
    }

    const handleAddSymptom = () => {
        if(!currentSymptom) return;
        const updatedAppointment = {...appointment};
        updatedAppointment.symptoms.push(currentSymptom);
        setAppointment(updatedAppointment);
        setCurrentSymptom('');
    }

    const handleConfirmAppointment = () => {
        if(!selectedDoctor) return showAlert('Please select a doctor', 'warning');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': props.token,
            },
        };
        appointment.doctorId = selectedDoctor._id;
        client.post('/appointment/create', appointment, config)
        .then(res => {
            setDialogOpen(false);
            setTimeout(() => window.location.reload(), 1200);
            showAlert('Appointment booked succesfully!', 'success');
        })
        .catch(err => {
            if(err.response)
                showAlert(err.response.data.message, 'warning');
            else showAlert('Server error, please try agian', 'error');
            setDialogOpen(false);
            setSubmitDisabled(false);
        })
    }

    if(isLoading) return <Loading/>
    return (
        <Layout>
            <Container>
                <div className='appointment-section'>
                    <Typography className='appointment-section-header'>Symptoms</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={appointment.isRoutine}
                                onChange={e => setAppointment({ ...appointment, isRoutine: e.target.checked })}
                                color="primary"
                            />
                        }
                        label="Routine Checkup"
                    /><br></br>
                    {!appointment.isRoutine ? (
                        <Fragment>
                            <div className='symptoms-container'>
                                {appointment.symptoms.map(symptom => (
                                    <Chip className='symptom-chip' label={symptom} onDelete={() => {handleDeleteSymptom(symptom)}} color="primary" />
                                ))}                        
                            </div>
                            <FormControl>
                                <InputLabel htmlFor="standard-adornment-password">Enter Symptom</InputLabel>
                                <Input                                                        
                                    value={currentSymptom}
                                    onChange={e => setCurrentSymptom(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleAddSymptom}>
                                                <AddIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Fragment>
                    ) : null}                    
                </div>
                <div className='appointment-section'>
                    <Typography className='appointment-section-header'>Pick Your Doctor</Typography>                    
                    <Autocomplete
                        style={{ width: 300 }}
                        options={doctors}
                        autoHighlight
                        getOptionLabel={option => option.name}
                        onChange={(event, doctor) => {
                            setSelectedDoctor(doctor);
                        }}
                        renderOption={option => (                            
                            <Tooltip title='add'>
                                <Fragment>
                                    <Avatar alt="doctor_display" src={option.profilePicture} /> &nbsp;&nbsp;
                                    {option.name}
                                </Fragment>
                            </Tooltip>                            
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Doctor"
                                variant="outlined"
                            />
                        )}
                    />
                    {selectedDoctor ? (
                        <Card className='selected-doctor-card'>
                            <CardHeader
                                avatar={ <Avatar src={selectedDoctor.profilePicture}/> }        
                                title={selectedDoctor.name}
                                subheader={selectedDoctor.qualification}
                            />
                            <CardContent>
                                <Typography>{selectedDoctor.speciality}</Typography>
                                <Rating name="read-only" value={selectedDoctor.rating} readOnly />
                            </CardContent>
                        </Card>
                    ): null}
                </div>
                <div className='appointment-section'>
                    <Typography className='appointment-section-header'>Schedule Appointment</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            className="appointment-date-picker"
                            margin="normal"                        
                            label="Select Date"
                            value={appointment.appointmentDate}
                            onChange={date => setAppointment({...appointment, appointmentDate: date})}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            className="appointment-time-picker"
                            label="Select Time"
                            value={appointment.appointmentTime}
                            onChange={time => setAppointment({...appointment, appointmentTime: time})}
                        />
                    </MuiPickersUtilsProvider>                    
                </div>
                <Button 
                    onClick={() => {setDialogOpen(true)}} 
                    className='appointment-confirm-button' 
                    variant='contained' 
                    color='primary'
                    disabled={submitDisabled}
                >
                    Book
                </Button>
            </Container>

            <Dialog
                open={isDialogOpen}
                onClose={() => {setDialogOpen(false)}}
            >
                <DialogTitle>Confirm Appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to book this appointment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setDialogOpen(false)}} color="primary">
                        No
                    </Button>
                    <Button disabled={submitDisabled} onClick={handleConfirmAppointment} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(CreateAppointment);