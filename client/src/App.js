import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from './utils/alert/Alert';
import AuthenticatedRoute from './AuthenticatedRoute';

import Landing from './pages/Landing/Landing';
import NotFound from './pages/NotFound';
import HomePatient from './pages/home/HomePatient';
 
import './App.css';

const App = (props) => {
	let landingPage = <Route exact path='/' component={Landing} />;
	if(props.loggedIn)
		landingPage = <AuthenticatedRoute exact auth={true} path='/' component={HomePatient} />
	return (
		<Router>
			<Switch>
				{landingPage}
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