import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
 
import './App.css';

const App = () => {
	return (
		<Router>
			<Switch>			
				<Route exact path='/' component={Landing} />			
				<Route component={NotFound} />
			</Switch>
		</Router>
	)	
}

export default App;