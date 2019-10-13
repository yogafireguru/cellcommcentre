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
    user: this.props.currentUser
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

  render() {
    const { channel, user } = this.state;

    return this.props.messages.length >= 0 ? (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(this.props.messages)}
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
  return {messages:state.messages.messages,error:state.errors.error}
}

export default connect(
  mapStateToProps,{ messagesStartListener,messagesStopListener }
)(Messages);