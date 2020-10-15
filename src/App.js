import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';

import Home from './Home';
import './App.css';

function App() {
  const [session, setSession] = useState(JSON.parse(localStorage.getItem('session')));
  
  useEffect(() => {
    let session = localStorage.getItem('session');
    let currentTime = new Date();
    if(session === null || session.expireTime <= currentTime.getTime()) {
      let data = { loggedIn: false, expireTime: 0 };
      localStorage.setItem('session', JSON.stringify(data));
    }
  }, [session]);

  function receiveLoginEvents(status, expireTime) {
    let data = { 'loggedIn': status, 'expireTime': expireTime };
    localStorage.setItem('session', JSON.stringify(data));
    setSession(data);
  }

  return (
    <Router>
      <div style={ { height: '100%' } }>

      <Switch>
        <Route path="/admin/login">
          <Login loggedIn = { session ? session.loggedIn : false } notifyLoginState = { receiveLoginEvents } />
        </Route>
        <Route path="/admin">
          <Home loggedIn = { session ? session.loggedIn : false } notifyLoginState = { receiveLoginEvents } />
        </Route>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
