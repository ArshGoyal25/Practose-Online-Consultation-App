import React from 'react'

import {
    CircularProgress
} from '@material-ui/core';
import './loading.css';

const Loading = () => (
    <div className='loading-page-loader'>
        <CircularProgress />
    </div>
)

export default Loading;