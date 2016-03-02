import * as c from '../actions/actions';

/** The initial state; no tokens and no user info */
const initialState = {
  accessToken: null,
  refreshToken: null,
  tracks: [],
  user: {
    loading: false,
    display_name: null,
    images: [],
    id: null,
  },
  playlists: {
    loading: false,
    items: [],
  },
  selectedPlaylist: {
    loading: false,
    toneLoading: false,
    id: null,
    name: null,
    tracks: [],
  }
};

/**
 * Our reducer
 */
export default function reduce(state = initialState, action) {
  switch (action.type) {

  // when we get the tokens... set the tokens!
  case c.SPOTIFY_TOKENS:
    const {accessToken, refreshToken} = action;
    return Object.assign({}, state, {accessToken, refreshToken});

  // set our loading property when the loading begins
  case c.SPOTIFY_ME_BEGIN:
    return Object.assign({}, state, {
      user: Object.assign({}, state.user, {loading: true})
    });

  // when we get the data merge it in
  case c.SPOTIFY_ME_SUCCESS:
    const {display_name, images, id} = action.data;
    return Object.assign({}, state, {
      user: Object.assign({}, state.user, {
        loading: false,
        display_name,
        images,
        id
      })
    });

  // currently no failure state :(
  case c.SPOTIFY_ME_FAILURE:
    return state;

  // indicate our load has started
  case c.PLAYLIST_LOAD_BEGIN:
    return Object.assign({}, state, {
      playlists: Object.assign({}, state.playlists, { loading:true })
    });

  // set our playlist items when we get 'em
  case c.PLAYLIST_LOAD_SUCCESS:
    return Object.assign({}, state, {
      playlists: Object.assign({}, state.playlists, {
        loading: false,
        items: action.data.items,
      })
    });

  // currently no failure state :(
  case c.PLAYLIST_LOAD_FAILURE:
    return state;

  // indicate that we're loadin, kiddo
  case c.TRACK_LIST_BEGIN:
    return Object.assign({}, state, {
      selectedPlaylist: Object.assign({}, state.selectedPlaylist, { loading: true, toneLoading: true })
    });

  // when we get the data set the data, kiddo
  case c.TRACK_LIST_SUCCESS:
    return Object.assign({}, state, {
      selectedPlaylist: Object.assign({}, state.selectedPlaylist, {
        loading: false,
        id: action.data.id,
        name: action.data.name,
        tracks: action.data.tracks.items.map(i => i.track),
      })
    });

  // when we get the tone data, update each track in our selected playlist
  // assumes that order in the tone data array is the same as the playlist array
  case c.TRACK_LIST_TONE:
    // first do a check to make sure the playlist is still selected
    if (action.playlistID === state.selectedPlaylist.id) {
      const newTracks = [];
      for (let i = 0; i < action.data.length; i++) {
        const {id, tone} = action.data[i];
        const track = state.selectedPlaylist.tracks[i];
        // only tack on the tone data if the ids match
        if (id === track.id) {
          newTracks.push(Object.assign({}, track, { tone }));
        } else {
          newTracks.push(track)
        }
      }
      // update our track data and set loading to false
      return Object.assign({}, state, {
        selectedPlaylist: Object.assign({}, state.selectedPlaylist, {
          toneLoading: false,
          tracks: newTracks,
        })
      });
    }
    return state;

  // currently no failure state :(
  case c.TRACK_LIST_FAILURE:
    return state;

  default:
    return state;
  }
}
