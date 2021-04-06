import React, { Fragment } from 'react';
import Navbar from './Navbar';

const Layout = (props) => {
    return (
        <Fragment>
            <Navbar></Navbar>
            <div>
                {props.children}
            </div>            
        </Fragment>
    )
}

export default Layout;