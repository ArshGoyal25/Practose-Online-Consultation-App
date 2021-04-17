import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from './utils/alert/Alert';
import AuthenticatedRoute from './AuthenticatedRoute';

import Loading from './components/Layout/Loading';
import Landing from './pages/Landing/Landing';
import NotFound from './pages/NotFound';
import HomePatient from './pages/home/HomePatient';
import CreateAppointment from './pages/createAppointment/CreateAppointment';
import FindDoctor from './pages/findDoctor/findDoctor';
import {updateLoading, loginSuccesful} from './actions/auth';
import Chat from './pages/chat/Chat';
import client from './utils/axios/client';
 
import './App.css';
import ViewAppointments from './pages/viewAppointments/ViewAppointments';

const App = (props) => {
	useEffect(() => {
		let user = localStorage.getItem('practoUser');
		if(!user) return updateLoading(false);
		user = JSON.parse(user);		
		const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': user.token,
            },
        };
		client.post('/user/authenticateUser', {}, config)
		.then(res => {
			loginSuccesful(res.data);
		})
		.catch(err => {
			updateLoading(false);
		})
	}, []);

	if(props.loading) return <Loading/>

	let landingPage = <Route exact path='/' component={Landing} />;
	if(props.loggedIn)
		landingPage = <AuthenticatedRoute exact auth={true} path='/' component={HomePatient} />
	return (
		<Router>
			<Switch>
				{landingPage}
				<AuthenticatedRoute exact auth={true} path='/create-appointment' component={CreateAppointment} />
				<AuthenticatedRoute exact auth={true} path='/view-appointments' component={ViewAppointments} />
				<AuthenticatedRoute exact auth={true} path='/chat' component={Chat} />
				<AuthenticatedRoute exact auth={true} path='/doctors' component={FindDoctor} />
				<AuthenticatedRoute auth={false} component={NotFound} />
			</Switch>
			<Alert></Alert>
		</Router>
	)	
}

const mapStateToProps = (state) => ({
	loggedIn: state.auth.loggedIn,
	loading: state.auth.loading,	
});

export default connect(mapStateToProps)(App);