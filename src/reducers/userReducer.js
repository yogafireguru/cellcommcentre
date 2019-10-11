import * as actionTypes from '../actions/types';


const initialUserState = {
    currentUser:null,
    isLoading:true
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
                currentUser:action.payload.currentUser,
                isLoading:false
            }    
        default:
            return state;
    }
};

export default userReducer;