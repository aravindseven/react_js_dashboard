import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Map from './map/Map'
import LocalCam from './map/LocalCam'
import ViewFeed from './map/ViewFeed'


class App extends Component {

  render() {
    return (
      <Router history={history}>
       
          <main class="h-100 main-app">
            <Switch>
              <Route exact path="/" component={Map} />
              <Route exact path="/localcam" component={LocalCam} />
              <Route exact path="/ipcam" component={Map} />
              <Route exact path="/viewfeed/:count" component={ViewFeed} />
            </Switch>
          </main>
        
      </Router>
    );
  }
}

export default App;
