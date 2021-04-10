import { INIT_CHAT } from './types';
import store from '../store';

export const initializeChat = () => {
    store.dispatch({
        type: INIT_CHAT,
    });
};