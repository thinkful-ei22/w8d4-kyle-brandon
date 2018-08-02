import React from 'react';
import {connect} from 'react-redux';
import {setUserIdle} from '../actions/auth';
import './idle-modal.css';

export class IdleModal extends React.Component {

  onClick() {
    this.props.dispatch(setUserIdle(false));
    console.log('click');
  }

  render() {
    return (
      <div className="idle-modal">
        <div className="content">
          <p>Are you still there? For your security, you will be logged out due to inactivity in 1 minute</p>
          <button type="submit" onClick={() => this.onClick()}>I'm still here</button>
        </div>
      </div>
    );
  }
}

export default connect()(IdleModal);
