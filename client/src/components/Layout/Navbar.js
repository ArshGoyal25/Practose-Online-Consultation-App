import React from 'react';
import {
    AppBar, Toolbar, Typography,
    Button
} from '@material-ui/core';

const Navbar = () => {
    return (        
        <AppBar position="static">
            <Toolbar>                                
                <Typography variant="h6">
                    Practose
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;