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
    ListItemText, FormControl, InputLabel,
    Input, InputAdornment
} from '@material-ui/core';

import {
    Autocomplete
} from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import io from 'socket.io-client/dist/socket.io';
import { initializeChat } from '../../actions/chat';
import { showAlert } from '../../utils/alert/Alert';
import './chat.css';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            chatData: null,
            chatUsers: [],
            mappedUsers: {},
            currentChat: null,
            currentMessage: ''
        }
        this.setSocket = (socket) => {
            this.setState({ socket });
        }
        this.setChatData = (chatData) => {
            this.setState({ chatData });
        }
        this.setChatUsers = (chatUsers) => {
            this.setState({ chatUsers });
        }
        this.setMappedUsers = (mappedUsers) => {
            this.setState({ mappedUsers });
        }
        this.setCurrentChat = (currentChat) => {
            this.setState({ currentChat });
        }
        this.setCurrentMessage = (currentMessage) => {
            this.setState({ currentMessage });
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.selectChat = this.selectChat.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    sendMessage(message, recipient) {
        const messageObj = {
            message,
            recipient,
            token: this.props.token
        }
        this.state.socket.emit('newMessage', messageObj, (ack) => {
            if(!ack.success) return showAlert(ack.message, 'error');
            this.setCurrentMessage('');
            const updatedChatData = {...this.state.chatData};
            updatedChatData[recipient].messages.push(ack.message);
            this.setChatData(updatedChatData);
        })
    }

    selectChat(id) {
        if(!(id in this.state.chatData)) {
            const updatedChatData = this.state.chatData;
            updatedChatData[id] = {messages: []};
            this.setChatData(updatedChatData);
        }
        this.setCurrentChat(id);
    }

    handleSendMessage(event) {
        event.preventDefault();
        if(!this.state.currentMessage) return;
        this.sendMessage(this.state.currentMessage, this.state.currentChat);
    }



    componentDidMount() {
        const self = this;
        const socket = io();
        socket.on('connect', () => {
            socket.emit('initialize', {id: this.props.user.id}, (ack) => {
                if(!ack.success) showAlert(ack.message, 'error');
            })
            self.setSocket(socket);
        });
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': this.props.token,
            },
        };
        // Fetch user chat history
        client.post('/user/getChats', {}, config)
        .then(res => {
            this.setChatData(res.data.chat);
        })
        .catch(err => {
            console.log(err);
        })
        // Fetch doctors 
        client.post('/user/getChatUsers', {}, config)
        .then((res) => {
            this.setChatUsers(res.data);
            const userObj = {};
            for(const user of res.data) userObj[user._id] = user;
            this.setMappedUsers(userObj);
        })
        .catch(err => {
            console.log(err);
        })

        socket.on('newMessage', (chat) => {
            const updatedMessages = {...this.state.chatData};
            if(!(chat.from in updatedMessages))
                updatedMessages[chat.from] = {messages: []};
            updatedMessages[chat.from].messages.push(chat);
            this.setChatData(updatedMessages);
        })
        
    }

    render() {
        if(this.state.socket === null || this.state.chatData === null) return <Loading/>;

        const chatHeader = (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Chat
                    </Typography>
                </Toolbar>
            </AppBar>
        )

        const search = (
            <Autocomplete
                options={this.state.chatUsers}
                getOptionLabel={option => option.name}
                onChange={(event, user) => {
                    if(user) this.selectChat(user._id);
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
                {Object.keys(this.state.chatData).map(id => (
                    <Fragment key={id}>
                        <ListItem 
                            alignItems="flex-start" 
                            className={`chat-list-item ${this.state.currentChat === id? 'active': ''}`}
                            onClick={() => this.selectChat(id)}
                        >
                            <ListItemAvatar>
                                <Avatar alt="doctor_display" src={this.state.mappedUsers[id].profilePicture} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={this.state.mappedUsers[id].name}
                            />
                        </ListItem>
                        <Divider/>
                    </Fragment>
                ))}            
            </List>
        )

        const chatMessages = (
            <Fragment>
                {this.state.currentChat ? (
                    (this.state.currentChat in this.state.chatData) ? (
                        this.state.chatData[this.state.currentChat].messages.map((message) => {
                            const timestamp = new Date(message.timestamp);
                            return <div className={`chat-message ${message.from == this.props.user.id ? 'self': 'other'}`}>
                                {message.message}
                                <div className='chat-message-timestamp'>{timestamp.toLocaleString()}</div>
                            </div>
                        })
                    ) : null
                ): null}
            </Fragment>
        )

        return (
            <Layout>
                <Container>
                    <Grid container className='chat-container'>
                        <Grid className='chat-container-grid left-container' item xs={4}>
                            {chatHeader}
                            {search}
                            {chatList}
                        </Grid>
                        <Grid className='chat-container-grid right-container' item xs={8}>
                            <div className='chat-message-container'>
                                {chatMessages}
                            </div>
                            {this.state.currentChat? (
                                    <div className='chat-input-container'>
                                        <form onSubmit={this.handleSendMessage}>
                                            <Paper className='chat-send-message-container'>
                                                <InputBase
                                                    className='chat-send-message-input'
                                                    placeholder="Send message"
                                                    value={this.state.currentMessage}
                                                    onChange={e => this.setCurrentMessage(e.target.value)}
                                                />
                                                <IconButton type='submit'>
                                                    <SendIcon />
                                                </IconButton>
                                            </Paper>
                                        </form>
                                    </div>
                            ): null }
                        </Grid>
                    </Grid>                
                </Container>
            </Layout>
        )
    }
}
    

const mapStateToProps = (state) => {
    return {
        initialized: state.chat.initialized,
        token: state.auth.token,
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(Chat);