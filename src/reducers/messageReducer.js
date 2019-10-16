import * as actionTypes from '../actions/types';

const initialMessagesState = {
    messages:[],
    percentUploaded:0,
    uploadState:"",
    uniqueUsers:0
 };

 const countUniqueUsers = messages => {
  const uniqueUsers = messages.reduce((acc, message) => {
    if (!acc.includes(message.user.name)) {
      acc.push(message.user.name);
    }
    return acc;
  }, []);
  return uniqueUsers.length;
};
  
  const messages_reducer = (state = initialMessagesState, action) => {
    switch (action.type) {
      case actionTypes.CREATE_MESSAGE_LISTENER:
            let newArray = state.messages.slice();
            newArray.splice(action.index, 0, action.payload);
            let uniqueUsers= countUniqueUsers(newArray);
            return {...state,messages:newArray,uniqueUsers:uniqueUsers};
      case actionTypes.STOP_MESSAGE_LISTENER:  
       return {
              ...state,messages:[]
            };  
      case actionTypes.PERCENT_UPLOAD:
          return {
            ...state,percentUploaded:action.payload
          };  
      case actionTypes.UPLOAD_STATUS:
          return {
            ...state,uploadState:action.payload
          };     
      case actionTypes.CREATE_MESSAGE:
        return state;        
      default:
        return state;
    }
  }

  export default messages_reducer;