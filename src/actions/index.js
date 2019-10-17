import * as actionTypes from './types';
import firebase from '../firebase';
import md5 from 'md5';
import uuidv4 from "uuid/v4";

// For now removed Social Login , need to be implemented in MVP 2
// Tested Google Auth  add <GoogleAuth/> in Login Page to check functionality
// Need to check Email and Social SignIn Flow

/* user actions*/
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

/*Direct messages and build user presence*/

export const usersStartListener = (currentUserUid) =>  async dispatch  =>{

  let usersRef= firebase.database().ref("users");

   usersRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        dispatch ({
          type:actionTypes.CREATE_USER_LISTENER,
          payload:user
        });     
      }
   });
  
}  

export const usersStopListener = () =>  dispatch  =>{
  let usersRef= firebase.database().ref("users");
  usersRef.off();
  dispatch ({
      type:actionTypes.STOP_USER_LISTENER,
      payload:'Users Listener Stopped'
  }); 

}  


export const createUserPresence = (currentUserUid) => dispatch =>{
  let connectedRef = firebase.database().ref(".info/connected");
  let presenceRef = firebase.database().ref("presence");

  
  connectedRef.on("value", snap => {
    if (snap.val() === true) {
      const ref = presenceRef.child(currentUserUid);
     
      ref.set(true);
      
      dispatch ({
        type:actionTypes.CREATE_USER_PRESENCE,
        payload:'Users Added In User Presence'
      }); 

      ref.onDisconnect().remove(err => {
        if (err !== null) {
          dispatch ({
            type:actionTypes.ADD_ERROR,
            error:err
           });  
        }
      });
    }
  });

}

export const userPresenceStartListener = (currentUserUid) =>  async dispatch  =>{

  let presenceRef= firebase.database().ref("presence");

  presenceRef.on("child_added", snap => {
    if (currentUserUid !== snap.key) {

    dispatch ({
        type:actionTypes.START_USER_PRESENCE_LISTENER,
        payload:{userId:snap.key,connected:true}
      });
    }
  }); 

  presenceRef.on("child_removed", snap => {
    if (currentUserUid !== snap.key) {

    dispatch ({
        type:actionTypes.START_USER_PRESENCE_LISTENER,
        payload:{userId:snap.key,connected:false}
      });
    }
  });
  
}  

export const userPresenceStopListener = () =>  async dispatch  =>{
  let presence= firebase.database().ref("presence");
  presence.off();
  dispatch ({
      type:actionTypes.STOP_USER_PRESENCE_LISTENER,
      payload:'Users Presence Listener Stopped'
  }); 

}

/* Channel Actions */

export const setPrivateChannel = isPrivateChannel => {
    return {
      type: actionTypes.SET_PRIVATE_CHANNEL,
      payload: {
        isPrivateChannel
      }
    };
  };
  


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
        payload:'Channel Listener Stopped'
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


/*Messages Action*/

export const messagesStartListener = (channelId) =>  async dispatch  =>{

    let messagesRef= firebase.database().ref("messages").child(channelId).limitToLast(10000);

    messagesRef.on("child_added", snap => {
       dispatch ({
           type:actionTypes.CREATE_MESSAGE_LISTENER,
           payload:snap.val()
       }); 
     });
    

}  

export const messagesStopListener = (channelId) =>  dispatch  =>{
   let messagesRef= firebase.database().ref("messages");
   messagesRef.child(channelId).off();
   dispatch ({
       type:actionTypes.STOP_MESSAGE_LISTENER,
       payload:'Message Listener Stopped'
   }); 

}


export const createMessage = (user,channel,messageContent,fileUrl = null) =>  async dispatch  =>{

    let messagesRef= firebase.database().ref("messages");

    let message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL
        }
      };

      if (fileUrl !== null) {
        message["image"] = fileUrl;
      } else {
        message["content"] = messageContent;
      }

      await messagesRef
      .child(channel.id)
      .push()
      .set(message)
      .then(() => {
            dispatch ({
                type:actionTypes.CREATE_MESSAGE,
                payload:'Message Added'
            }); 
        })
      .catch(err => {
            dispatch ({
                type:actionTypes.ADD_ERROR,
                error:err
            });  
      });


}  

/* File Upload*/

export const uploadFile = (user, channel,file,metadata) =>  async dispatch  =>{
    const pathToUpload = channel.id;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    const storageRef= firebase.storage().ref();

    let uploadTask=storageRef.child(filePath).put(file, metadata);

    uploadTask.on(
        "state_changed",
        snap => {
          const percentUploaded = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );

          dispatch ({
            type:actionTypes.PERCENT_UPLOAD,
            payload:percentUploaded
         }); 

         dispatch ({
            type:actionTypes.UPLOAD_STATUS,
            payload:"uploading"
         });
        },
        err => {
            dispatch ({
                type:actionTypes.ADD_ERROR,
                error:err
            });  
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadUrl => {
              firebase.database().ref("messages")
                .child(pathToUpload)
                .push()
                .set(dispatch(createMessage(user,channel,null,downloadUrl)))
                .then(() => {
                    dispatch ({
                        type:actionTypes.UPLOAD_STATUS,
                        payload:"uploaded"
                     });
                })
                .catch(err => {
                    dispatch ({
                        type:actionTypes.ADD_ERROR,
                        error:err
                    });  
                });   
            })
            .catch(err => {
                dispatch ({
                    type:actionTypes.ADD_ERROR,
                    error:err
                });  
            });
        }
      );


}