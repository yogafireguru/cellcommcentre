import * as actionTypes from './types';
import firebase from '../firebase';
import md5 from 'md5';

// For now removed Social Login , need to be implemented in MVP 2
// Tested Google Auth  add <GoogleAuth/> in Login Page to check functionality
// Need to check Email and Social SignIn Flow

export const signInGoogle = (userProfile) =>async dispatch =>{

    let usersRef = firebase.database().ref('users'); 

    await usersRef.child(userProfile.userId).set({
        name:userProfile.userEmail,
        avatar:userProfile.userPhotoURL
    }).then(()=>{
        dispatch ({
            type:actionTypes.SIGN_IN_GOOGLE,
            payload:userProfile
        });  
    }).catch(err => {
        dispatch ({
            type:actionTypes.ADD_ERROR,
            error:err
           });  
      });   
}

export const signInEmail = (userProfile) =>async dispatch =>{
   
    await firebase
        .auth()
        .signInWithEmailAndPassword(userProfile.email, userProfile.password)
        .then(signedInUser => {
          dispatch ({
            type:actionTypes.SIGN_IN_EMAIL,
            payload:signedInUser.user.displayName
           });  
        })
        .catch(err => {
            console.log(err);
            dispatch ({
                type:actionTypes.ADD_ERROR,
                error:err
               });  
        });

    
}

export const signOutGoogle = () => {
    return {
        type:actionTypes.SIGN_OUT_GOOGLE
    };
}

export const signOutEmail = () => dispatch => {
    firebase
        .auth()
        .signOut()
        .then(()=> {
                dispatch ({
                    type:actionTypes.SIGN_OUT_EMAIL
                })
              }
         );
}

export const setUser = user =>{
    return{
        type:actionTypes.SET_USER,
        payload:{
            currentUser:user
        }
    }
}

export const createUserWithEmailPassword = (createUser) =>  async dispatch  => {
        let usersRef = firebase.database().ref('users'); 
        await firebase
            .auth()
            .createUserWithEmailAndPassword(createUser.email,createUser.password)
            .then(createdUser =>{
                    createdUser.user.updateProfile({
                        displayName:createUser.username,
                        photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}d=identicon`
                    })
                    usersRef.child(createdUser.user.uid).set({
                        name:createUser.username,
                        avatar:`http://gravatar.com/avatar/${md5(createUser.email)}d=identicon`
                    })
            }).then(()=>{
                dispatch ({
                    type:actionTypes.CREATE_USER_EMAIL_PASSWORD,
                    payload:"User Created"
                });  
            }).catch(err=>{
                dispatch ({
                    type:actionTypes.ADD_ERROR,
                    error:err
                   });  
            });

            

};


/* Channel Actions */
export const setCurrentChannel = channel => {
    return {
      type: actionTypes.SET_CURRENT_CHANNEL,
      payload: {
        currentChannel: channel
      }
    }
  }

export const channelStartListener = () =>  async dispatch  =>{

     let channelsRef= firebase.database().ref("channels");

     channelsRef.on("child_added", snap => {
        dispatch ({
            type:actionTypes.CREATE_CHANNEL_LISTENER,
            payload:snap.val()
        }); 
      });
     

}  

export const channelStopListener = () =>  dispatch  =>{
    let channelsRef= firebase.database().ref("channels");
    channelsRef.off();
    dispatch ({
        type:actionTypes.STOP_CHANNEL_LISTENER,
        payload:'Listener Stopped'
    }); 

}  

export const createChannel = (channelData) =>  async dispatch  =>{

    let channelsRef= firebase.database().ref("channels");
   
    const { channelName, channelDetails, user } = channelData;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    await channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        dispatch ({
            type:actionTypes.CREATE_CHANNEL,
            payload:'Channel Added'
        }); 
      })
      .catch(err => {
        dispatch ({
            type:actionTypes.ADD_ERROR,
            error:err
           });  
      });
}  