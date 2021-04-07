import { CREATE_ALERT, CLOSE_ALERT } from '../actions/types';

const initialState = {
    type: '',
    open: false,
    message: '',
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
	case CREATE_ALERT:
        return {
            ...state,
            message: payload.message,
            type: payload.type,
            open: true,

        }
	case CLOSE_ALERT:
		return {
            ...state,
            message: '',
            type: '',
            open: false
        }
    default:
        return state;
    }    
}
