import { CREATE_ALERT, CLOSE_ALERT } from './types';
import store from '../store';

export const createAlert = (message, type) => {
    store.dispatch({
        type: CREATE_ALERT,
        payload: {
            message, 
            type
        }
    });        
};

export const closeAlert = () => {
    store.dispatch({ type: CLOSE_ALERT });
};