import React, {useState} from 'react';
import {
    AppBar, Tabs, Tab, TextField,
    Button
} from '@material-ui/core'
import './Login.css';

import client from '../../utils/axios/client';
import { showAlert } from '../../utils/alert/Alert';
import { loginSuccesful } from '../../actions/auth';

const Login = () => {
    const [value, setValue] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
    })

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const handleSignup = (event) => {
        event.preventDefault();        
        if(newUser.confirmPassword !== newUser.password)
            return showAlert("Passwords do not match", "warning");
        setLoading(true);
        client.post('/user/register', newUser)
        .then(res => {
            showAlert('Account created succesfully!', 'success');
            setTimeout(() => window.location.reload(), 1200);
        })
        .catch(err => {
            if(err.response)
                showAlert(err.response.data.message, 'warning');
            else showAlert('Server error, please try agian', 'error');
            setLoading(false);
        })
    }

    const handleLogin = (event) => {
        event.preventDefault();
        setLoading(true);
        client.post('/user/login', user)
        .then(res => {
            showAlert('Login Succesful!', 'success');
            localStorage.setItem('practoUser', res.data);
            loginSuccesful(res.data);
        })
        .catch(err => {
            if(err.response)
                showAlert(err.response.data.message, 'error');
            else showAlert('Server error, please try again', 'error');
            setLoading(false);
        })
    }

    const loginForm = (
        <form className='login-form' autoComplete="off" onSubmit={handleLogin}>
            <TextField 
                className='login-form-field' 
                label="Email" 
                color="primary" 
                fullWidth
                value={user.email}
                onChange={e => setUser({...user, email: e.target.value})}
            />
            <TextField 
                className='login-form-field' 
                label="Password" 
                color="primary"
                type='password'
                fullWidth                
                value={user.password}
                onChange={e => setUser({...user, password: e.target.value})}
            />
            <Button type='submit' variant='contained' color='primary' className='login-button' disabled={isLoading}>Login</Button>
        </form>
    )

    const signupForm = (
        <form className='signup-form' autoComplete="off" onSubmit={handleSignup}>
            <TextField 
                className='login-form-field' 
                label="Email" 
                color="primary" 
                required fullWidth
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField 
                className='login-form-field' 
                label="Full Name" 
                color="primary" 
                required fullWidth
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField 
                className='login-form-field' 
                label="Username" 
                color="primary" 
                required fullWidth
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField 
                className='login-form-field' 
                label="Password" 
                color="primary" 
                type="password" 
                required fullWidth
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
            <TextField 
                className='login-form-field' 
                label="Confirm Password" 
                color="primary" 
                type="password" 
                required fullWidth
                value={newUser.confirmPassword}
                onChange={e => setNewUser({ ...newUser, confirmPassword: e.target.value })}
            />
            <Button variant='contained' color='primary' className='login-button' type='submit' disabled={isLoading}>Signup</Button>
        </form>
    )
    return (
        <div className='login-container'>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Login"/>
                    <Tab label="Sign Up"/>
                </Tabs>
            </AppBar>
            <div className='login-form-container'>
                {value === 0 ? loginForm: signupForm}
            </div>
        </div>
    )   
}

export default Login;