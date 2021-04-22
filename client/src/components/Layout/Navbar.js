import React from 'react';
import {
    AppBar, Toolbar, Typography,
    Button
} from '@material-ui/core';
import {connect} from 'react-redux';

const Navbar = (props) => {
    console.log(props.auth);
    const handleLogOut = () => {
        window.localStorage.removeItem('practoUser');
        window.location.reload();
    }
    return (        
        <AppBar position="static" style={{display: 'flex', flexGrow: '1'}}>
            <Toolbar>                                
                <Typography variant="h6" style={{display: 'flex', flexGrow: '1'}}>
                    Practose
                </Typography>
                {props.auth.loggedIn ?
                    <Button color="inherit" style={{float: 'right'}} onClick={handleLogOut}>Logout</Button>:
                    null
                }                
            </Toolbar>
        </AppBar>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Navbar);