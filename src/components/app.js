import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import IdleModal from './idle-modal';
import {refreshAuthToken, clearAuth, setUserIdle} from '../actions/auth';
// import {clearAuth} from '../actions/auth';

const allowedIdleTime = 5 * 60 * 1000; // min * seconds * miliseconds
const ONE_MINUTE = 60 * 1000;

export class App extends React.Component {

  componentDidUpdate(prevProps) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
      this.setIdleTimers();
    } else if (prevProps.loggedIn && !this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
      this.clearIdleTimers();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      10 * 60 * 1000 // Ten minutes
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  onClick() {
    if (this.props.loggedIn) {
      this.clearIdleTimers();
      this.setIdleTimers();
    }
  }

  onKeyPress() {
    if (this.props.loggedIn) {
      this.clearIdleTimers();
      this.setIdleTimers();
    }
  }

  setIdleTimers() {
    this.idleLogoutTimer = setTimeout(() => this.logOut(), allowedIdleTime);
    this.idlePromptTimer = setTimeout(
      () => this.props.dispatch(setUserIdle(true)),
      allowedIdleTime - ONE_MINUTE
    );
  }

  clearIdleTimers() {
    clearTimeout(this.idleLogoutTimer);
    clearTimeout(this.idlePromptTimer);
  }

  logOut() {
    this.props.dispatch(clearAuth());
    this.props.dispatch(setUserIdle(false));
  }

  render() {
    let idlePrompt;
    if (this.props.isIdle) {
      idlePrompt = <IdleModal />;
    }
    return (
      <div className="app"
        onClick={() => this.onClick()}
        onKeyPress={() => this.onKeyPress()}
      >
        {idlePrompt}
        <HeaderBar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null,
  isIdle: state.auth.isIdle
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
