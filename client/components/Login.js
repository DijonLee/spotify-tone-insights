import React, { Component } from 'react';
import loginSVG from '../log_in.svg';

/**
 * Our login page
 * Has a login button that hit's the login url
 */
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <h2>You'll need to log in first.</h2>
        <a href="/login" className="login-btn" dangerouslySetInnerHTML={{__html: loginSVG}}></a>
      </div>
    );
  }
}
