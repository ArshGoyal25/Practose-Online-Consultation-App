import React from 'react';
import Layout from '../../components/Layout/Layout';
import {
    Container, Typography 
} from '@material-ui/core';
import './Landing.css';
import Login from '../../components/Login/Login';

const Landing = () => {
    return (
        <Layout>            
            <div className='landing-banner'>                
                <Typography className='landing-banner-title'>Practose</Typography>
            </div>
            <Login></Login>     
        </Layout>
    )
}

export default Landing;