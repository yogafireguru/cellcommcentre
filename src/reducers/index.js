import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import channel_reducer from './channelReducer';

export default combineReducers ({
    user: userReducer,
    errors:errorReducer,
    channel: channel_reducer
});