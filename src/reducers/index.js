import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import channel_reducer from './channelReducer';
import messages_reducer from './messageReducer';

export default combineReducers ({
    user: userReducer,
    errors:errorReducer,
    channel: channel_reducer,
    messages:messages_reducer
});