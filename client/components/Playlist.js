import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setTokens, loadPlaylist } from '../actions/actions';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = { sort: null };
  }

  componentDidMount() {
    // injected via react-router
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(loadPlaylist(params.playlistID));
  }

  sortTracks(a, b) {
    const { sort } = this.state;
    switch (sort) {
    case 'name':
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;

    case 'album':
      if (a.album.name < b.album.name) return -1;
      if (a.album.name > b.album.name) return 1;
      return 0;

    case 'artists':
      const aArtists = a.artists.map(a => a.name).join(', ');
      const bArtists = b.artists.map(a => a.name).join(', ');
      if (aArtists < bArtists) return -1;
      if (aArtists > bArtists) return 1;
      return 0;

    case 'anger':
    case 'disgust':
    case 'fear':
    case 'joy':
    case 'sadness':
      const indexMap = { anger: 0, disgust: 1, fear: 2, joy: 3, sadness: 4};
      const aTone = a.error ? 0 : (a.tone ? a.tone[0].tones[indexMap[sort]].score : 0);
      const bTone = b.error ? 0 : (b.tone ? b.tone[0].tones[indexMap[sort]].score : 0);
      return bTone - aTone;

    default:
      return a.playlist_index - b.playlist_index;
    }
  }

  render() {
    // injected via react-router and connect
    const { params, selectedPlaylist } = this.props;
    const { loading, name, id, tracks } = selectedPlaylist;
    const { accessToken, refreshToken, playlistID } = params;
    if (loading) {
      return (
        <div className="selected-playlist list-container">
          <h3 className="section">Loading...</h3>
        </div>
      );
    }
    return (
      <div className="selected-playlist list-container">
        <h3 className="section">{name}</h3>
        <div className="list-container">
          <div className="labels-container section">
            <div className="labels">
              <span className="number label" onClick={e => this.setState({sort: null})}>#</span>
              <span className="name label" onClick={e => this.setState({sort: 'name'})}>Name</span>
              <span className="tone anger label" onClick={e => this.setState({sort: 'anger'})}>Anger</span>
              <span className="tone disgust label" onClick={e => this.setState({sort: 'disgust'})}>Disgust</span>
              <span className="tone fear label" onClick={e => this.setState({sort: 'fear'})}>Fear</span>
              <span className="tone joy label" onClick={e => this.setState({sort: 'joy'})}>Joy</span>
              <span className="tone sadness label" onClick={e => this.setState({sort: 'sadness'})}>Sadness</span>
              <span className="artists label" onClick={e => this.setState({sort: 'artists'})}>Artists</span>
              <span className="album label" onClick={e => this.setState({sort: 'album'})}>Album</span>
            </div>
          </div>
          <ul className="track-list list section">{
            tracks.sort((a, b) => this.sortTracks(a, b))
              .map(t => <Track key={t.id} track={t} />)
          }</ul>
        </div>
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
    const { error } = track;
    const toneLoading = !(track.tone && track.tone.length);
    const [ anger = {}, disgust = {}, fear = {}, joy = {}, sadness = {} ] = toneLoading ? [] : track.tone[0].tones;
    return(
      <li className="track item">
        <span className="number">{track.playlist_index + 1}</span>
        <span className="name">{track.name}</span>
        <span className="tone anger">{this.getText(toneLoading, error, anger.score)}</span>
        <span className="tone disgust">{this.getText(toneLoading, error, disgust.score)}</span>
        <span className="tone fear">{this.getText(toneLoading, error, fear.score)}</span>
        <span className="tone joy">{this.getText(toneLoading, error, joy.score)}</span>
        <span className="tone sadness">{this.getText(toneLoading, error, sadness.score)}</span>
        <span className="artists">{track.artists.map(a => a.name).join(', ')}</span>
        <span className="album">{track.album.name}</span>
      </li>
    );
  }

  getText(toneLoading, error, score) {
    if (error) {
      return "uh oh";
    } else if (toneLoading) {
      return "Loading...";
    }
    return `${(score * 100).toFixed(2)}%`;
  }
}

// select all the state to inject via props, might eventually want to be more selective
export default connect(state => state)(Playlist);
