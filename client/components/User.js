import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMyInfo, setTokens } from '../actions/actions';

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {
  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(getMyInfo());
  }

  /** Render the user's info */
  render() {
    // injected via react-router and connect
    const { dispatch, user, children } = this.props;
    const { loading, display_name, images } = user;
    const imageUrl = images[0] ? images[0].url : "";
    // if we're still loading, indicate such
    if (loading) {
      return (
        <div className="user">
          <div className="user-header"><h2>Loading...</h2></div>
        </div>
      )
    }
    // otherwise show dat user page
    return (
      <div className="user">
        <div className="header-container">
          <div className="user-header">{loading ?
            <h2>Loading...</h2> : [
            <img src={imageUrl} />,
            <h2>{display_name}</h2>
          ]}</div>
        </div>
        {children}
      </div>
    );
  }
}

export default connect(state => state)(User);
