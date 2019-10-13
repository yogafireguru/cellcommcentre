import React from "react";
import { connect } from "react-redux";
import { createMessage } from "../../actions";
import { Segment, Button, Input } from "semantic-ui-react";

class MessageForm extends React.Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: []
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  sendMessage = () => {
    const { user,message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      this.props.createMessage(user,channel,message);
      this.setState({ loading: false, message: "", errors: [] });
    }
  };

  render() {
    const { message, loading } = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) =>{
  return {error:state.errors.error}
}

export default connect(
  mapStateToProps,{ createMessage }
)(MessageForm);