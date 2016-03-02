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
    const { loading, toneLoading, name, id, tracks } = selectedPlaylist;
    if (loading) {
      return (
        <div className="selected-playlist">
          <h3>Loading...</h3>
        </div>
      );
    }
    return (
      <div className="selected-playlist list-container">
        <h3>{name}</h3>
        <ul className="track-list list">{[
          <li key="tracklabels" className="track labels item">
            <span className="name">Name</span>
            { toneLoading ? null : <span className="tone anger">Anger</span> }
            { toneLoading ? null : <span className="tone disgust">Disgust</span> }
            { toneLoading ? null : <span className="tone fear">Fear</span> }
            { toneLoading ? null : <span className="tone joy">Joy</span> }
            { toneLoading ? null : <span className="tone sadness">Sadness</span> }
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
    const toneLoading = !(track.tone && track.tone.length);
    const [ anger, disgust, fear, joy, sadness ] = toneLoading ? [] : track.tone[0].tones;
    return(
      <li className="track item">
        <span className="name">{track.name}</span>
        { toneLoading ? null : <span className="tone anger">{(anger.score * 100).toFixed(2)}%</span> }
        { toneLoading ? null : <span className="tone disgust">{(disgust.score * 100).toFixed(2)}%</span> }
        { toneLoading ? null : <span className="tone fear">{(fear.score * 100).toFixed(2)}%</span> }
        { toneLoading ? null : <span className="tone joy">{(joy.score * 100).toFixed(2)}%</span> }
        { toneLoading ? null : <span className="tone sadness">{(sadness.score * 100).toFixed(2)}%</span> }
        <span className="artists">{track.artists.map(a => a.name).join(', ')}</span>
        <span className="album">{track.album.name}</span>
      </li>
    );
  }
}

// select all the state to inject via props, might eventually want to be more selective
export default connect(state => state)(Playlist);
