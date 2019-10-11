import React from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';
import GoogleAuth from './GoogleAuth';

import { connect } from 'react-redux';
import { signInEmail } from '../../actions';
//import history from '../../history';

class Login extends React.Component {

constructor(props, ...args) {
        super(props, ...args);
        this._reCaptchaRef = React.createRef();
}

  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
    reCaptchaVal:''
  };

  componentDidUpdate(prevProps) {

    if((this.props.currentUser!==prevProps.currentUser) || (this.props.error!== prevProps.error))
    {
        //let {error, currentUser} = this.props;
        let {error} = this.props;

        if(error){
          this.setState({
            errors : this.state.errors.concat(error),
            loading:false
          })
        }

        //if(currentUser){
        //  history.push("/");
        //}
    }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCaptchaChange = (value) => {
    this.setState({ reCaptchaVal:value });
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      let userInfo = {
        email:this.state.email,
        password:this.state.password
       };
      /*firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });*/
        this.props.signInEmail(userInfo);
    }
  };

  isFormValid = ({ email, password,reCaptchaVal }) => (email && password&& reCaptchaVal);

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    let { email, password, errors, loading } = this.state;
    

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to Cell Network
          </Header>
          <GoogleAuth />                       
          <br/>
          <br/>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <ReCAPTCHA
                size="normal"
                ref={this._reCaptchaRef}
                sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                onChange={this.onCaptchaChange}
                data-theme="dark"            
                render="explicit"
             />
             <br/>

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) =>{
  return {currentUser:state.user.currentUser,error:state.errors.error}
}

export default connect(mapStateToProps,{signInEmail})(Login);