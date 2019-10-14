import React from "react";
import { connect } from "react-redux";
import { createMessage,uploadFile } from "../../actions";
import { Segment, Button, Input } from "semantic-ui-react";
import FileModal from './FileModal';

class MessageForm extends React.Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal:false  
  };

  openModal = () => this.setState({modal:true}); 
  closeModal = () => this.setState({modal:false}); 



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

  uploadFile = (file, metadata) => {
    this.props.uploadFile(this.state.user,this.state.channel,file,metadata);
  };

  render() {
    const { message, loading,modal } = this.state;

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
           onClick={this.openModal}
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
          <FileModal 
           modal={modal}
           closeModal={this.closeModal}
           uploadFile={this.uploadFile}
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = (state) =>{
  return {percentUploaded:state.messages.percentUploaded,error:state.errors.error}
}

export default connect(
  mapStateToProps,{ createMessage,uploadFile }
)(MessageForm);