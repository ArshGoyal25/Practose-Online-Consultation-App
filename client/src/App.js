import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import NotFound from './pages/NotFound';
import Alert from './utils/alert/Alert';
 
import './App.css';

const App = () => {
	return (
		<Router>
			<Switch>			
				<Route exact path='/' component={Landing} />			
				<Route component={NotFound} />
			</Switch>
			<Alert></Alert>
		</Router>
	)	
}

export default App;