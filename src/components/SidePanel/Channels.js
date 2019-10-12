import React from "react";
import { connect } from "react-redux";
import { setCurrentChannel,channelStartListener,channelStopListener,createChannel } from "../../actions";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import Spinner from '../../Spinner';


class Channels extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    channelName: "",
    channelDetails: "",
    modal: false,
    firstLoad: true
  };

  componentDidMount() {
    this.props.channelStartListener();
  }

  componentDidUpdate(prevProps) {
    if(this.props.channels!==prevProps.channels)
    {
        this.setFirstChannel(this.props.channels[0]);
    }
 }   

  componentWillUnmount() {
      this.removeListeners();
  }

  removeListeners = () => {
    this.props.channelStopListener();
  };

  setFirstChannel = (setChannel) => {
    const firstChannel = setChannel;
    if (this.state.firstLoad && this.props.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelName, channelDetails, user } = this.state;


    const newChannel = {
     channelName: channelName,
     channelDetails: channelDetails,
     user:user
    };

   this.props.createChannel(newChannel);

   this.closeModal();

  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (   
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7}}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  render() {
    const { modal } = this.state;  

    return this.props.channels.length !== 0 ? (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({this.props.channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          <div style={{ height: '450px', overflowY:'scroll'}}> {this.displayChannels(this.props.channels)}</div>  

                   
        </Menu.Menu>

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    ):<Spinner content="Loading Channels..."/> ;
  }
}

const mapStateToProps = (state) =>{
    return {channels:state.channel.channels,error:state.errors.error}
}

export default connect(
    mapStateToProps,
  { setCurrentChannel,channelStartListener,channelStopListener,createChannel }
)(Channels);