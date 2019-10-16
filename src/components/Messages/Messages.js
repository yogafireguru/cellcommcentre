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
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    searchTerm:'',
    searchLoading:false,
    searchResults:[]
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    this.props.messagesStartListener(channelId);
  };

  componentWillUnmount() {
    const { channel } = this.state;

    if (channel) {
      this.removeListeners(channel.id);
    }
  }

  removeListeners = (channelId) => {
   this.props.messagesStopListener(channelId);
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

  displayChannelName = channel => (channel ? `#${channel.name}` : "");
  
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
    const { channel, user,searchTerm, searchResults, searchLoading } = this.state;
    return this.props.messages.length >= 0 && this.props.uniqueUsers>=1 ? (
      <React.Fragment>
        <MessagesHeader 
         channelName={this.displayChannelName(channel)}
         uniqueUsers={this.props.uniqueUsers}
         handleSearchChange={this.handleSearchChange}
         searchLoading={searchLoading}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(this.props.messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          currentChannel={channel}
          currentUser={user}
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