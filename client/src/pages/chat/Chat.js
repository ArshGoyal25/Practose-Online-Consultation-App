import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Layout/Loading';
import client from '../../utils/axios/client';

import {
    Card, Container, CardContent,
    Typography, Button, CardActions,
    Grid, AppBar, Toolbar, IconButton,
    Divider, InputBase, Paper, List,
    ListItem, ListItemAvatar, Avatar,
    ListItemText
} from '@material-ui/core';

import {
    Autocomplete
} from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';

import io from 'socket.io-client/dist/socket.io';
import { initializeChat } from '../../actions/chat';
import { showAlert } from '../../utils/alert/Alert';
import './chat.css';


const Chat = (props) => {

    const [socket, setSocket] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [mappedDoctors, setMappedDoctors] = useState({}); // key: docId, value: doctor details
    const [currentChat, setCurrentChat] = useState(null); // the id of user

    useEffect(() => {
        const socket = io('http://localhost:8000');
        socket.on('connect', () => {
            socket.emit('initialize', {id: props.user.id}, (ack) => {
                if(!ack.success) showAlert(ack.message, 'error');
            })
            setSocket(socket);
        });
        socket.on('newMessage', (chat) => {
            const updatedMessages = chatData;
            if(!(chat.from in updatedMessages))
                updatedMessages[chat.from] = [];
            updatedMessages[chat.from].push(chat);
            setChatData({...updatedMessages});
        })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': props.token,
            },
        };
        // Fetch user chat history
        client.post('/user/getChats', {}, config)
        .then(res => {
            setChatData(res.data.chat);
        })
        .catch(err => {
            console.log(err);
        })
        // Fetch doctors 
        client.post('/user/doctors', {}, config)
        .then((res) => {
            setDoctors(res.data);
            const doctorObj = {};
            for(const doctor of res.data) doctorObj[doctor._id] = doctor;
            setMappedDoctors(doctorObj);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);
    
    if(socket === null || chatData === null) return <Loading/>

    const sendMessage = (message, recipient) => {
        const messageObj = {
            message,
            recipient,
            token: props.token
        }
        socket.emit('newMessage', messageObj, (ack) => {
            if(!ack.success) showAlert(ack.message, 'error');
        })
    }

    const selectChat = (id) => {
        if(!(id in chatData)) {
            const updatedChatData = chatData;
            updatedChatData[id] = [];
            setChatData(updatedChatData);
        }
        setCurrentChat(id);
    }


    const chatHeader = (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Chat
                </Typography>
            </Toolbar>
        </AppBar>
    )
    const options = ['Option 1', 'Option 2'];

    const search = (
        <Autocomplete
            options={doctors}
            getOptionLabel={option => option.name}
            onChange={(event, doctor) => {
                if(doctor) selectChat(doctor._id);
            }}
            renderOption={option => (                                            
                <Fragment>
                    <Avatar alt="doctor_display" src={option.profilePicture} /> &nbsp;&nbsp;
                    {option.name}
                </Fragment>
            )}
            renderInput={(params) => (
                <Paper ref={params.InputProps.ref} className='chat-search-container'>
                    <InputBase
                        className='chat-search-input'
                        placeholder="Search doctors"
                        {...params.inputProps}
                    />
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            )}
        />
    )

    const chatList = (
        <List>
            {Object.keys(chatData).map(id => (
                <Fragment key={id}>
                    <ListItem 
                        alignItems="flex-start" 
                        className={`chat-list-item ${currentChat === id? 'active': ''}`}
                        onClick={() => selectChat(id)}
                    >
                        <ListItemAvatar>
                            <Avatar alt="doctor_display" src={mappedDoctors[id].profilePicture} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={mappedDoctors[id].name}
                        />
                    </ListItem>
                    <Divider/>
                </Fragment>
            ))}            
        </List>
    )
    
    const chatMessages = (
        <Fragment>
            {currentChat ?
                chatData[currentChat].map((message) => {
                    return <div className={`chat-message ${message.from == props.user.id ? 'self': 'other'}`}>
                        {message.message}
                    </div>
                }): null
            }
        </Fragment>
    )
    

    return (
        <Layout>
            <Container>
                <Grid container className='chat-container'>
                    <Grid className='chat-container-grid left-container' item md={4}>
                        {chatHeader}
                        {search}
                        {chatList}
                    </Grid>
                    <Grid className='chat-container-grid right-container' item md={8}>
                        {chatMessages}
                    </Grid>
                </Grid>                
            </Container>
        </Layout>
    )
}

const mapStateToProps = (state) => {
    return {
        initialized: state.chat.initialized,
        token: state.auth.token,
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(Chat);