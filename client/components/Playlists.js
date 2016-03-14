import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setTokens, loadPlaylists } from '../actions/actions';

/**
 * Our playlists page
 * Displays a list of playlists, nah mean?
 */
class Playlists extends Component {
  /** When we mount, load our playlists */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(loadPlaylists());
  }

  /** Render the playlist info */
  render() {
    // injected via connect and react-router
    const { params, playlists } = this.props;
    const { loading, items } = playlists;
    const {accessToken, refreshToken} = params;
    if (loading) {
      return (
        <div className="playlists">
          <h3 className="section">Loading</h3>
        </div>
      );
    }
    return (
      <div className="playlists list-container">
        <div className="labels-container section">
          <div className="labels">
            <span className="name label">Name</span>
            <span className="track-count label">Track Count</span>
          </div>
        </div>
        <ul className="playlist-list list section">{
          items.map(p =>
            <PlaylistListItem key={p.id} playlist={p} accessToken={accessToken} refreshToken={refreshToken} />
          )
        }</ul>
      </div>
    );
  }
}

/**
 * An individual playlist list item - might eventually move to own file
 */
class PlaylistListItem extends Component {
  render() {
    const { playlist: p, accessToken, refreshToken } = this.props;
    return(
      <li className="playlist item">
        <Link to={`/user/${accessToken}/${refreshToken}/playlist/${p.owner.id}/${p.id}`}>
          <span className="name">{p.name}</span>
          <span className="track-count">{p.tracks.total}</span>
        </Link>
      </li>
    );
  }
}

// select all the state to inject via props, might eventually want to be more selective
export default connect(state => state)(Playlists);
