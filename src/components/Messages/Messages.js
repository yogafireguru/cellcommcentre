import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import { connect } from "react-redux";
import { messagesStartListener,messagesStopListener } from "../../actions";
import Spinner from '../../Spinner';



import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    isPrivateChannel:this.props.isPrivateChannel,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    searchTerm:'',
    searchLoading:false,
    searchResults:[]
  };

  componentDidMount() {
    const { channel, user,isPrivateChannel } = this.state;

    if (channel && user) {
      this.addListeners(channel.id,isPrivateChannel);
    }
  }

  addListeners = (channelId,isPrivateChannel) => {
    this.addMessageListener(channelId,isPrivateChannel);
  };

  addMessageListener = (channelId,isPrivateChannel) => {
    this.props.messagesStartListener(channelId,isPrivateChannel);
  };

  componentWillUnmount() {
    const { channel,isPrivateChannel } = this.state;

    if (channel) {
      this.removeListeners(channel.id,isPrivateChannel);
    }
  }

  removeListeners = (channelId,isPrivateChannel) => {
   this.props.messagesStopListener(channelId,isPrivateChannel);
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

    displayChannelName = channel => {
      return channel
        ? `${this.state.privateChannel ? "@" : "#"}${channel.name}`
        : "";
    };
  
  handleSearchChange = event =>{
    this.setState({
      searchTerm:event.target.value,
      searchLoading:true
    },()=>this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.props.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  render() {
    const { channel, user,searchTerm, searchResults, searchLoading,isPrivateChannel } = this.state;
    return this.props.messages.length >= 0 && this.props.uniqueUsers>=1 ? (
      <React.Fragment>
        <MessagesHeader 
         channelName={this.displayChannelName(channel)}
         uniqueUsers={this.props.uniqueUsers}
         handleSearchChange={this.handleSearchChange}
         searchLoading={searchLoading}
         isPrivateChannel={isPrivateChannel}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(this.props.messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={isPrivateChannel}
        />
      </React.Fragment>
    ):<Spinner content="Loading Messages..."/> ;
  }
}

const mapStateToProps = (state) =>{
  return {messages:state.messages.messages,uniqueUsers:state.messages.uniqueUsers,error:state.errors.error}
}

export default connect(
  mapStateToProps,{ messagesStartListener,messagesStopListener }
)(Messages);