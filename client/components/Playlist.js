import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTokens, loadPlaylist } from '../actions/actions';

class Playlist extends Component {
  componentDidMount() {
    // injected via react-router
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(loadPlaylist(params.playlistID));
  }

  render() {
    // injected via react-router and connect
    const { params, selectedPlaylist } = this.props;
    const { loading, name, id, tracks } = selectedPlaylist;
    if (loading) {
      return (
        <div className="selected-playlist">
          <h3>Loading</h3>
        </div>
      );
    }
    return (
      <div className="selected-playlist list-container">
        <h3>{name}</h3>
        <ul className="track-list list">{[
          <li key="tracklabels" className="track labels item">
            <span className="name">Name</span>
            <span className="artists">Artists</span>
            <span className="album">Album</span>
          </li>
        ].concat(
          tracks.map(t =>
            <Track key={t.id} track={t} />
          )
        )}</ul>
      </div>
    );
  }
}

/**
 * An individual playlist track item - might eventually move to own file
 */
class Track extends Component {
  render() {
    const { track } = this.props;
    return(
      <li className="track item">
        <span className="name">{track.name}</span>
        <span className="artists">{track.artists.map(a => a.name).join(', ')}</span>
        <span className="album">{track.album.name}</span>
      </li>
    );
  }
}

// select all the state to inject via props, might eventually want to be more selective
export default connect(state => state)(Playlist);
