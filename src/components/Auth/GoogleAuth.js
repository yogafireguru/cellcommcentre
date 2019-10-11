import React from 'react';

import { connect } from 'react-redux';
import { signInGoogle, signOutGoogle } from '../../actions';
import history from '../../history';

class GoogleAuth extends React.Component {

    componentDidMount(){
            window.gapi.load('client:auth2',()=>{
            window.gapi.client.init({
                clientId:process.env.REACT_APP_GOOGLEAUTH_CLIENT_ID,
                scope:"profile email"
            }).then(()=>{
                this.auth=window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    }

    onAuthChange = (isSignedIn) =>{
        if(isSignedIn) {
            let userInfo = {
                userId:this.auth.currentUser.get().getId(),
                userEmail:this.auth.currentUser.get().getBasicProfile().getEmail(),
                userPhotoURL:this.auth.currentUser.get().getBasicProfile().getImageUrl(),
                signInStatus:isSignedIn
            }
            this.props.signInGoogle(userInfo);
            history.push('/');
        }
        else{
            this.props.signOutGoogle();
            history.push('/login');

        }
    };

    onSignIn = () =>{
        this.auth.signIn();
    }

    render() {
        return (
            <React.Fragment>
                 <button className="ui google plus circular icon button" onClick={this.onSignIn}>
                    <i aria-hidden="true" className="google plus icon"></i>
                </button>
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state) => {

    return {currentUser:state.user.currentUser};
};

export default connect(mapStateToProps,{signInGoogle,signOutGoogle})(GoogleAuth);