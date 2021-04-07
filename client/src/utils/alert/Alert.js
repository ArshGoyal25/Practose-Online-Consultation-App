import React from 'react';
import { connect } from 'react-redux';
import { Snackbar } from '@material-ui/core';

import { createAlert, closeAlert } from '../../actions/alert';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {    
	  
	const handleClose = (event, reason) => {
		if (reason !== 'clickaway')
            closeAlert();
	};
	
    return (
        <Snackbar open={props.alert.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
			<MuiAlert  variant="filled" onClose={closeAlert} severity={props.alert.type}>
				{props.alert.message}
			</MuiAlert>
      	</Snackbar>
    )    
}

export const showAlert = (message, type) => {
    createAlert(message, type);
}

const mapStateToProps = (state) => ({
    alert: state.alert
})

export default connect(mapStateToProps)(Alert);