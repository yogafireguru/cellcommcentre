import React from "react";
import { connect } from "react-redux";
import { createMessage,uploadFile } from "../../actions";
import { Segment, Button, Input } from "semantic-ui-react";
import FileModal from './FileModal';
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  state = {
    message: "",
    isPrivateChannel:this.props.isPrivateChannel,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal:false  
  };

  openModal = () => this.setState({modal:true}); 
  closeModal = () => this.setState({modal:false}); 


  componentDidUpdate(prevProps) {

    if((this.props.isPrivateChannel!== prevProps.isPrivateChannel))
    {
        this.setState({isPrivateChannel:this.props.isPrivateChannel});
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  sendMessage = () => {
    const { user,message, channel } = this.state;
    const {isPrivateChannel} =this.props;
    if (message) {
      this.setState({ loading: true });
      this.props.createMessage(user,channel,message,null,isPrivateChannel);
      this.setState({ loading: false, message: "", errors: [] });
    }
  };

  uploadFile = (file, metadata) => {
    this.props.uploadFile(this.state.user,this.state.channel,file,metadata,this.props.isPrivateChannel);
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
            disabled={this.props.uploadState === "uploading"}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
         
        </Button.Group>

        <FileModal 
           modal={modal}
           closeModal={this.closeModal}
           uploadFile={this.uploadFile}
          />

        <ProgressBar
          uploadState={this.props.uploadState}
          percentUploaded={this.props.percentUploaded}
        />

      </Segment>
    );
  }
}

const mapStateToProps = (state) =>{
  return {percentUploaded:state.messages.percentUploaded,uploadState:state.messages.uploadState,isPrivateChannel:state.channel.isPrivateChannel,error:state.errors.error}
}

export default connect(
  mapStateToProps,{ createMessage,uploadFile }
)(MessageForm);