import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';
import chat from './chat';

export default combineReducers({
	auth,
	alert,
	chat,
});