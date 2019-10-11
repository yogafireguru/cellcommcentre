import * as actionTypes from '../actions/types';


const initialErrorState = {
  error:null
};

export default (state=initialErrorState, action) =>{
    switch (action.type) {
      case actionTypes.ADD_ERROR:
          return {...state,error:action.error}
      default:
        return initialErrorState;
    }
  }