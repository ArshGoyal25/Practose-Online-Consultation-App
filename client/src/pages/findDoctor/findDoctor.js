import 'date-fns';
import React, { Fragment, useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import DateFnsUtils from '@date-io/date-fns';
import client from '../../utils/axios/client';
import { connect } from 'react-redux';
import Loading from '../../components/Layout/Loading';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';

import {
    Card, CardHeader, Container, CardContent,
    Typography, Button, CardActions,
    Grid, TextField, Checkbox, FormControlLabel,
    InputAdornment, IconButton, FormControl,
    InputLabel, Input, Chip, Avatar, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Paper
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
import './findDoctor.css';



const FindDoctor = (props) => {
    const [symptoms, setSymptoms] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [specialities, setSpecialities] = useState([]);
    const [counts, setCounts] = useState({});

    useEffect(() => {
        client.post('/user/doctors')
        .then(res => {
            const tempDoctors = res.data.map(doctor => ({...doctor, id:doctor._id }));
            setDoctors(tempDoctors);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);


    const handleDeleteSymptom = (symptom) => {
        setSymptoms(symptoms.filter(x => x !== symptom));
    }

    const handleAddSymptom = (symptom) => {
        if(!symptom) return;
        const updatedSymptoms = [...symptoms, symptom];
        setSymptoms(updatedSymptoms);
        filterSpeciality(symptom);
    }

    // const handleConfirmAppointment = () => {
    //     if(!selectedDoctor) return showAlert('Please select a doctor', 'warning');
    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'x-auth-token': props.token,
    //         },
    //     };
    //     appointment.doctorId = selectedDoctor._id;
    //     client.post('/appointment/create', appointment, config)
    //     .then(res => {
    //         setDialogOpen(false);
    //         setTimeout(() => window.location.reload(), 1200);
    //         showAlert('Appointment booked succesfully!', 'success');
    //     })
    //     .catch(err => {
    //         if(err.response)
    //             showAlert(err.response.data.message, 'warning');
    //         else showAlert('Server error, please try agian', 'error');
    //         setDialogOpen(false);
    //         setSubmitDisabled(false);
    //     })
    // }

    function sort_object(obj) {
        const items = Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        const temp = items.slice(0,5)[0]
        console.log(temp)
        setSpecialities(temp)
    } 

    const filterSpeciality = (symptom) => {
        if(!symptom) return;
        console.log(symptoms_list[symptom])
        symptoms_list[symptom].forEach( key => {
            console.log(key)
            if(counts[key] === undefined){
                counts[key] = 1
            }else{
                counts[key] += 1
            }
        })
        // console.log(counts)
        // var keys = Object.keys(symptoms_list);
        // keys.forEach(function(key) {
        //     console.log(key, symptoms_list[key])
        // });
        // console.log(symptoms_list)
        sort_object(counts)
    }

    console.log(specialities)





    const speciality = ["Cardiologist", "Audiologist", "Dentist", "ENT Specialist", "Gynaecologist", "General Physician", "Paediatrician", "Pyschiatrist", "Radiologist", "Pulmologist", "Oncologist", "Neurologist", "Orthopedic"]
    const symptoms_list = { Cold : [speciality[5], speciality[3]] , BodyPain : [speciality[5],speciality[10]], 
        Fever : [speciality[5]], Hearing_Loss : [speciality[1]] , 
        Tooth_Pain : [speciality[2]] , Fracture : [speciality[12], speciality[7]] , MentalHealth : [speciality[7]], LungProblem : [speciality[9]]
    }

    if(isLoading) return <Loading/>
    return (
        <Layout>
            <Container>
                <div className='appointment-section'>
                    <Typography className='appointment-section-header'>List of Doctors</Typography> 
                    <div className='symptoms-container'>
                                {symptoms.map(symptom => (
                                    <Chip className='symptom-chip' label={symptom} onDelete={() => {handleDeleteSymptom(symptom)}} color="primary" />
                                ))}                        
                    </div>    
                    <Autocomplete
                        style={{ width: 300 }}
                        options={Object.keys(symptoms_list)}
                        autoHighlight
                        getOptionLabel={option => option}
                        onChange={(event, symptom) => {
                            handleAddSymptom(symptom);

                        }}
                        renderOption={option => (                            
                            <Tooltip title='add'>
                                <Fragment>
                                    {option}
                                </Fragment>
                            </Tooltip>                            
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Enter Symptoms"
                                variant="outlined"
                            />
                        )}
                    />

                    <div style={{ height: 300, width: '100%' }}>
                        <DataGrid
                            columns={[
                            {
                                field: 'profilePicture',
                                headerName : 'Profile',
                                renderCell : (params) => (
                                    <Avatar alt="doctor_display" src={params.value} />
                                ),
                                flex: 0.2,
                            },
                            {
                                field: 'name',
                                headerName : 'Name',
                                flex: 0.2,
                            },
                            {
                                field: 'speciality',
                                headerName : 'Speciality',
                                flex: 0.3,
                            },
                            {
                                field: 'qualification',
                                headerName : 'Qualification',
                                flex: 0.3,
                            },
                            {
                                field: 'rating',
                                headerName : 'Rating',
                                renderCell : (params) => (
                                    <Rating name="read-only" value={params.value} readOnly />
                                ),
                                flex: 0.3,
                            },
                            
                            ]}
                            
                            rows={doctors}
                            filterModel={{
                                items: [
                                  { columnField: 'speciality', operatorValue: 'contains', value: specialities[0]  },
                                ],
                              }}
                        />
                        </div>

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
                {/* <div className='appointment-section'>
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
                </div> */}
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
                    {/* <Button disabled={submitDisabled} onClick={handleConfirmAppointment} color="primary" autoFocus>
                        Yes
                    </Button> */}
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

export default connect(mapStateToProps)(FindDoctor);