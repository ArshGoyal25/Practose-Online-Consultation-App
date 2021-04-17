import 'date-fns';
import React, { Fragment, useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import DateFnsUtils from '@date-io/date-fns';
import client from '../../utils/axios/client';
import { connect } from 'react-redux';
import Loading from '../../components/Layout/Loading';
import { DataGrid } from '@material-ui/data-grid';
import { GridLinkOperator, XGrid } from '@material-ui/x-grid';

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

import {specialities, symptomMapping} from './specialities';
import './findDoctor.css';



const FindDoctor = (props) => {
    const [symptoms, setSymptoms] = useState(new Set());
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [counts, setCounts] = useState({});
    const [highestScore, setHighestScore] = useState(0);

    useEffect(() => {
        client.post('/user/doctors')
        .then(res => {
            const tempDoctors = res.data.map(doctor => ({...doctor, id:doctor._id, score: 0 }));
            setDoctors(tempDoctors);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        })
        const initialCounts = {};
        for(const speciality of specialities) initialCounts[speciality] = 0;
        setCounts(initialCounts);        
    }, []);


    const handleDeleteSymptom = (symptom) => {
        const updatedSymptoms = new Set(symptoms);
        updateCounts(symptom, -1);
        updatedSymptoms.delete(symptom);
        setSymptoms(updatedSymptoms);
    }

    const updateCounts = (symptom, x) => {
        const updatedCounts = {...counts};
        for(const speciality of symptomMapping[symptom]) updatedCounts[speciality] += x;
        let newHighestScore = 0;        
        for(const speciality of Object.keys(updatedCounts)) {            
            if(!Number.isNaN(updatedCounts[speciality]))
                newHighestScore = Math.max(newHighestScore, updatedCounts[speciality]);
        }
        setDoctors(doctors.map(doctor => {
            const updatedDoctor = {...doctor, score: updatedCounts[doctor.speciality]}            
            return updatedDoctor;
        }));
        setHighestScore(newHighestScore);
        setCounts(updatedCounts);
        console.log(updatedCounts);
        console.log(newHighestScore);
    }

    const handleAddSymptom = (symptom) => {
        if(!symptom) return;
        if(symptoms.has(symptoms)) return;
        updateCounts(symptom, 1);
        const updatedSymptoms = new Set(symptoms);
        updatedSymptoms.add(symptom);
        setSymptoms(updatedSymptoms);
    }
        
    

    if(isLoading) return <Loading/>
    return (
        <Layout>
            <Container>
                <div className='appointment-section'>
                    <Typography className='appointment-section-header'>List of Doctors</Typography> 
                    <div className='symptoms-container'>
                                {Array.from(symptoms).map(symptom => (
                                    <Chip className='symptom-chip' label={symptom} onDelete={() => {handleDeleteSymptom(symptom)}} color="primary" />
                                ))}                        
                    </div>    
                    <Autocomplete
                        style={{ width: 300 }}
                        options={Object.keys(symptomMapping)}
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

                    <div style={{ height: 500, width: '100%' }}>
                        <DataGrid
                            columns={[{
                                field: 'profilePicture',
                                headerName : 'Profile',
                                renderCell : (params) => (
                                    <Avatar alt="doctor_display" src={params.value} />
                                ),
                                flex: 0.2,
                            }, {
                                field: 'name',
                                headerName : 'Name',
                                flex: 0.2,
                            }, {
                                field: 'speciality',
                                headerName : 'Speciality',
                                flex: 0.3,
                            }, {
                                field: 'qualification',
                                headerName : 'Qualification',
                                flex: 0.3,
                            }, {
                                field: 'rating',
                                headerName : 'Rating',
                                renderCell : (params) => (
                                    <Rating name="read-only" value={params.value} readOnly />
                                ),
                                flex: 0.3,
                            }, {
                                field: 'score',
                                headerName: 'score',
                                hide: true
                            }]}
                            
                            rows={doctors}
                            filterModel={{
                                items: [
                                    { columnField: 'score', operatorValue: 'equals', value: `${highestScore}` },
                                ],
                              }}
                        />
                        </div>

                </div>
            </Container>

        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(FindDoctor);