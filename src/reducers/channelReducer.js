import * as actionTypes from '../actions/types';

const initialChannelState = {
    channels:[],
    currentChannel: null,
    isPrivateChannel:false
  };
  
  const channel_reducer = (state = initialChannelState, action) => {
    switch (action.type) {
      case actionTypes.SET_CURRENT_CHANNEL:
        return {
          ...state,
          currentChannel: action.payload.currentChannel
        }
      case actionTypes.CREATE_CHANNEL_LISTENER:
            let newArray = state.channels.slice();
            newArray.splice(action.index, 0, action.payload);
            return {...state,channels:newArray};
      case actionTypes.STOP_CHANNEL_LISTENER:  
       return {
              ...state,channels:[],currentChannel:null
            };  
      case actionTypes.CREATE_CHANNEL:
        return state;     
      case actionTypes.SET_PRIVATE_CHANNEL:
            return {
              ...state,
              isPrivateChannel: action.payload.isPrivateChannel
            };     
      default:
        return state;
    }
  }

  export default channel_reducer;