import React from 'react';
import Layout from '../../components/Layout/Layout';

import {
    Card, Container, CardContent,
    Typography, Button, CardActions,
    Grid
} from '@material-ui/core';
import './homePatient.css';

const HomePatient = () => {
    return (
        <Layout>
            <Container>
                <div className="home-patient-container">
                    <a className='home-patient-item-link' href='/view-appointments'>
                        <Button variant='contained' color='primary' className='view-appointments-button'>View Appointments</Button>
                    </a>
                    <Grid container spacing={6}>
                        <Grid item md={4}>
                            <a className='home-patient-item-link' href="/create-appointment">
                                <div className='home-patient-item'>
                                    <img
                                        className='home-patient-item-image' 
                                        src="/images/book_appointment.png"
                                    />
                                    <Typography>Book An appointment</Typography>
                                </div>
                            </a>                            
                        </Grid>
                        <Grid item md={4}>
                            <a className='home-patient-item-link' href="/doctors">
                                <div className='home-patient-item'>
                                    <img 
                                        className='home-patient-item-image' 
                                        src="/images/find_doctor.png"
                                    />
                                    <Typography>Find a doctor</Typography>
                                </div>
                            </a>
                        </Grid>
                        <Grid item md={4}>
                            <a className='home-patient-item-link' href="/chat">
                                <div className='home-patient-item'>
                                    <img 
                                        className='home-patient-item-image' 
                                        src="/images/chat_doctor.png"
                                    />
                                    <Typography>Chat with your doctor</Typography>
                                </div>
                            </a>
                        </Grid>
                    </Grid>
                </div>                
            </Container>            
        </Layout>
    )
}

export default HomePatient;