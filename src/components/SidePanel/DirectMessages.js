import React from "react";
//import firebase from "../../firebase";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from 'react-redux';
import { usersStartListener,usersStopListener,createUserPresence,userPresenceStartListener,userPresenceStopListener,setCurrentChannel, setPrivateChannel  } from '../../actions';


class DirectMessages extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    showUsers:[]
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }


  componentDidUpdate(prevProps) {

    if((this.props.users!== prevProps.users) || (this.props.connectedUsers!==prevProps.connectedUsers))
    {
        this.addStatusToUser();
    }
  }

  componentWillUnmount(){
      this.props.usersStopListener();
      this.props.userPresenceStopListener();
  }

  addListeners = currentUserUid => {
    this.props.usersStartListener(currentUserUid);
    this.props.createUserPresence(currentUserUid);
    this.props.userPresenceStartListener(currentUserUid);
  };



  addStatusToUser = () => {
    const updatedUsers = this.props.users.reduce((acc, user) => {
      var checkConnected = this.props.connectedUsers.find(connUser => connUser.userId === user.uid);
      if (checkConnected) {
        user["status"] = `${checkConnected.connected ? "online" : "offline"}`;
      }
        return acc.concat(user);
      }, []);
    this.setState({ showUsers: updatedUsers });
  };

  isUserOnline = user => user.status === "online";

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  setActiveChannel = userId => {
    this.setState({ activeChannel: userId });
  };

  render() {
    const { showUsers,activeChannel } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
          ({showUsers.length})
        </Menu.Item>
        <div style={{ height: '200px', overflowY:'scroll'}}> 
        {showUsers.map(user => (
          <Menu.Item
            key={user.uid}
            active={user.uid === activeChannel}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
        </div>
      </Menu.Menu>
    );
  }
}


const mapStateToProps = (state) =>{
    return {users:state.user.users,connectedUsers:state.user.connectedUsers,error:state.errors.error}
}

export default connect(mapStateToProps,{usersStartListener,usersStopListener,createUserPresence,userPresenceStartListener,userPresenceStopListener,setCurrentChannel, setPrivateChannel })(DirectMessages);