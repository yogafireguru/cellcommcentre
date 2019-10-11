import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Switch, Route} from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore,applyMiddleware,compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

import App from './components/App'; 
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import 'semantic-ui-css/semantic.min.css';

import * as serviceWorker from './serviceWorker';

import * as ROUTES from './constants/routes';

import history from './history';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers,composeEnhancers(applyMiddleware(thunk)));

const Root = () =>{
    return(
            <Router history={history}>
                <Switch>
                    <Route exact path={ROUTES.HOME} component={App} />
                    <Route path={ROUTES.LOGIN} component={Login} />
                    <Route path={ROUTES.REGISTER} component={Register} />
                </Switch>
            </Router>
          );
};

ReactDOM.render(
    <Provider store={store}>
       <Root />
    </Provider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
