import React from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import { connect } from 'react-redux';
import { createUserWithEmailPassword } from '../../actions';
//import history from '../../history';


class Register extends React.Component {

    constructor(props, ...args) {
        super(props, ...args);
        this._reCaptchaRef = React.createRef();
    }

    state = {
        username:'',
        email:'',
        password:'',
        passwordConfirmation:'',
        reCaptchaVal:'',
        errors: [],
        loading:false
    }

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
              //history.push("/");
            //}
        }
      }

    handleChange =(event) =>{
        this.setState({[event.target.name]:event.target.value});
    }

    onCaptchaChange = (value) => {
        this.setState({ reCaptchaVal:value });
    }

    isFormValid = () => {
        let errors = [];
        let error;
    
        if (this.isFormEmpty(this.state)) {
          error = { message: "Fill in all fields" };
          this.setState({ errors: errors.concat(error) });
          return false;
        } else if (!this.isPasswordValid(this.state)) {
          error = { message: "Password is invalid" };
          this.setState({ errors: errors.concat(error) });
          return false;
        } else if(this.isCaptchaChecked(this.state)){
            error = { message: "Please Select Captcha" };
            this.setState({ errors: errors.concat(error) });
            return false;
        }
        else {
          return true;
        }
      };
    
      isFormEmpty = ({ username, email, password, passwordConfirmation,reCaptchaVal }) => {
        return (
          !username.length ||
          !email.length ||
          !password.length ||
          !passwordConfirmation.length
        );
      };

      isCaptchaChecked =({reCaptchaVal}) =>{
          return !reCaptchaVal.length;
      }
    
      isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
          return false;
        } else if (password !== passwordConfirmation) {
          return false;
        } else {
          return true;
        }
      };
    
    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);


    handleSubmit = event => {
            event.preventDefault();
            if (this.isFormValid()) {
               this.setState({ errors: [], loading: true });
               this.props.createUserWithEmailPassword(this.state);
            }
    };
        
    handleInputError = (errors, inputName) => {
            return errors.some(error => error.message.toLowerCase().includes(inputName))
              ? "error"
              : "";
    }; 

    render(){

        let {username,email,password,passwordConfirmation,errors,loading} = this.state;
       
        return(
           <Grid textAlign="center" verticalAlign="middle" className="app">
               <Grid.Column style ={{maxWidth:450}}>
                <Header as="h1" icon color="orange" textAlign="center" >
                    <Icon name="puzzle piece" color="orange">
                        Register
                    </Icon>
                </Header>
                <Form onSubmit={this.handleSubmit} size="large">
                    <Segment stacked>                        
                    
                        <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="Username" 
                        onChange={this.handleChange} type="text" value={username}  className={this.handleInputError(errors, "email")}/>

                        <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" 
                        onChange={this.handleChange} type="email" value={email}  className={this.handleInputError(errors, "email")}/>

                        <Form.Input fluid name="password" icon="lock" iconPosition="left" 
                        placeholder="Password" 
                        onChange={this.handleChange} type="password" value={password}  className={this.handleInputError(errors, "email")}/>

                        <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" 
                        placeholder="Password Confirmation" 
                        onChange={this.handleChange} type="password" value={passwordConfirmation}  className={this.handleInputError(errors, "email")}/>

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
                            color="orange"
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
               

                <Message>Already a User? <Link to="/login">Login</Link></Message>
               </Grid.Column>
                
           </Grid>
        );
    }

}

const mapStateToProps = (state) =>{
    return {currentUser:state.user.currentUser,error:state.errors.error}
}

export default connect(mapStateToProps,{createUserWithEmailPassword})(Register);