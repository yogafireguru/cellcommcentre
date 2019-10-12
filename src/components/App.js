import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import './App.css';

const App = ({currentUser}) =>{
  return (
          <Grid columns="equal" className="app" style={{background: '#eee'}}> 
           
              <SidePanel currentUser={currentUser}/>
 
            <Grid.Column style={{marginLeft: 320}}>
              <Messages />
            </Grid.Column>
            <Grid.Column width={4}>
              <MetaPanel />
            </Grid.Column>
          </Grid>
        );
}

const mapStateToProps = state => ({
  currentUser:state.user.currentUser
});

export default connect(mapStateToProps)(App);
