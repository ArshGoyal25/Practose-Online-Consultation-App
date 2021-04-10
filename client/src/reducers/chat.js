import { INIT_CHAT } from '../actions/types';

const initialState = {
    initialized: false,
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
	case INIT_CHAT:
        return {
            ...state,
            initialState: true
        }
    default:
        return state;
    }
}
