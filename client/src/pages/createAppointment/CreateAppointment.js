import 'date-fns';
import React, { Fragment, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import DateFnsUtils from '@date-io/date-fns';

import {
    Card, Container, CardContent,
    Typography, Button, CardActions,
    Grid, TextField, Checkbox, FormControlLabel,
    InputAdornment, IconButton, FormControl,
    InputLabel, Input, Chip
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers';
  
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import './createAppointment.css';

const CreateAppointment = () => {
    const [appointment, setAppointment] = useState({
        isRoutine: false,
        symptoms: [],
        appointmentDate: new Date(),
        appointmentTime: new Date(),
    })
    const [currentSymptom, setCurrentSymptom] = useState('');
    const [docterQuery, setDoctorQuery] = useState('');

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
                    <FormControl>
                        <InputLabel htmlFor="standard-adornment-password">Search Doctor</InputLabel>
                        <Input                                                        
                            value={docterQuery}
                            onChange={e => setDoctorQuery(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleAddSymptom}>
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
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
                <Button variant='contained' color='primary'>Book</Button>
            </Container>
        </Layout>
    )
}

export default CreateAppointment;