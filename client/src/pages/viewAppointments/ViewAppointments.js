import 'date-fns';
import React, { Fragment, useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import client from '../../utils/axios/client';
import { connect } from 'react-redux';
import Loading from '../../components/Layout/Loading';

import {
    Card, CardHeader, Container, Button,
    Typography, InputLabel, Input, Chip, Avatar
} from '@material-ui/core';

import './viewAppointments.css';
import {showAlert} from '../../utils/alert/Alert';

const AppointmentCard = ({appointment, user, past}) => {

    const handleDeleteAppointment = (appointmentId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': props.token,
            },
        };
        client.post('/appointment/delete', {appointmentId}, config)
        .then(res => {
            showAlert('Appointment deleted!', 'success');
            setTimeout(() => window.location.reload(), 1200);
        })
        .catch(err => {
            if(err.response)
                showAlert(err.response.data.message, 'warning');
            else showAlert('Server error, please try agian', 'error');
        })
    }
    console.log(appointment);
    return (
        <div className={`appointment-card ${past ? 'past': ''}`}>
            <div className='appointment-card-pane left'>
                {user.isDoctor ? (
                    <Fragment>
                        <div className='appointment-card-user'>
                            <Avatar alt="patient_display" src={appointment.patientId.profilePicture} />
                            <p>{appointment.patientId.name}</p>
                        </div>
                    </Fragment>                    

                ): (
                    <Fragment>
                        <div className='appointment-card-user'>
                        <Avatar alt="doctor_display" src={appointment.doctorId.profilePicture} />
                            <p>{appointment.doctorId.name}</p>
                        </div>                        
                    </Fragment>                    
                )}
                <div className='appointment-symptoms'>
                    {appointment.symptoms.map(symptom => (
                        <Chip className='symptom-chip' label={symptom}  color="primary" />
                    ))}
                </div>
            </div>
            <div className='appointment-card-pane right'>
                <p className='appointment-date'>{appointment.appointmentDate.toLocaleString()}</p>
                {appointment.isRoutine ?
                    <p className='appointment-routine'>Routine Appointment</p>
                : null}
                <Button variant="contained" color="secondary">
                    Delete Appointment
                </Button>
            </div>
        </div>
    )
}

const CreateAppointment = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': props.token,
            },
        };
        client.post('/appointment/fetch', {}, config)
        .then(res => {
            const allAppointments = res.data.appointments.map(appointment => {
                appointment.appointmentDate = new Date(appointment.appointmentDate);
                return appointment;
            })
            const currentDate = new Date();
            setPastAppointments(allAppointments.filter(appointment => appointment.appointmentDate < currentDate));
            setAppointments(allAppointments.filter(appointment => appointment.appointmentDate >= currentDate));
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);


    if(isLoading) return <Loading/>
    return (
        <Layout>
            <Container>
                {appointments.length ? (
                    <Fragment>
                        <Typography className='appointment-header'>Upcoming Appointments</Typography>
                        {appointments.map(appointment => (
                            <AppointmentCard 
                                appointment={appointment}
                                user={props.user}
                            />
                        ))}
                    </Fragment>
                ): null}
                <br></br>
                {pastAppointments.length ? (
                    <Fragment>
                        <Typography className='appointment-header'>Past Appointments</Typography>
                        {pastAppointments.map(appointment => (
                            <AppointmentCard 
                                appointment={appointment}
                                user={props.user}
                                past={true}
                            />
                        ))}
                    </Fragment>
                ): null}
            </Container>
        </Layout>
                
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(CreateAppointment);