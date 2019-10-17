import * as actionTypes from '../actions/types';


const initialUserState = {
    users:[],
    currentUser:null,
    isLoading:true,
    connectedUsers:[]
};

const userReducer = (state=initialUserState, action) =>{
    switch(action.type){
        case actionTypes.SIGN_IN_GOOGLE:
            return {...state,currentUser:action.payload}
        case actionTypes.SIGN_IN_EMAIL:
            return {...state,currentUser:action.payload}    
        case actionTypes.SIGN_OUT_GOOGLE:
                return {...state,currentUser:null}
        case actionTypes.SIGN_OUT_EMAIL:
             return {...initialUserState,isLoading:false}    ;       
        case actionTypes.CREATE_USER_EMAIL_PASSWORD:
            return {...state,currentUser:action.payload}
        case actionTypes.SET_USER:
            return {
                ...state,
                currentUser:action.payload.currentUser,
                isLoading:false
            } 
        case actionTypes.CREATE_USER_LISTENER:   
             let newArray = state.users.slice();
             newArray.splice(action.index, 0, action.payload);
             return {...state,users:newArray};
        case actionTypes.STOP_USER_LISTENER:   
            return {
                ...state,users:[]
            };
        case actionTypes.CREATE_USER_PRESENCE:   
             return state;      
        case actionTypes.START_USER_PRESENCE_LISTENER:
                let connArray = state.connectedUsers.slice();
                connArray.splice(action.index, 0, action.payload);
                return {...state,connectedUsers:connArray};
        case actionTypes.STOP_USER_PRESENCE_LISTENER:
                return {
                    ...state,connectedUsers:[]
                };
                default:
            return state;
    }
};

export default userReducer;