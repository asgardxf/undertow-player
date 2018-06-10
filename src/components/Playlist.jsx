import React from 'react'


import Player from './Player'
const resourcesRoot = 'http://localhost:8000/';

function scrobble(artist, track) {
  return fetch('/scrobble/', {
    method: 'POST', credentials: 'include', body: JSON.stringify({artist, track})
  })
}


export default class Playlist extends React.Component {
  state = {
    isPlaying: false,
  }
  play = (url, title, currentIndex) => {
    const song = this.props.source[currentIndex]
    scrobble(song.attributes.artist, song.attributes.title)
    this.setState(prevState => {
      return {
        isPlaying: !prevState.isPlaying,
        title,
        url: resourcesRoot + '/' + this.props.baseUrl + '/' + url,
        currentIndex,
      }
    })
  }

  nextTrack = () => {
    this.setState(({currentIndex}) => {
      const song = this.props.source[currentIndex+1]
      if (!song) {
        return {
          isPlaying: false,
        }
      }
      scrobble(song.attributes.artist, song.attributes.title)
      return {
        currentIndex: currentIndex+1,
        url: resourcesRoot + '/' + this.props.baseUrl + '/' + song.path,
        title: song.attributes.title,
      }
    })
  }

  togglePlay = () => {
    this.setState(prevState => {
      return {
        isPlaying: !prevState.isPlaying,
      }
    })
  }

  render() {
    const {source = []} = this.props
    return <div className="playlist">
      {
        source.map((song, index) => <Song
          artist={song.attributes.artist}
          title={song.attributes.title}
          url={song.path}
          key={index}
          itemIndex={index}
          play={this.play}
        />)
      }
      <Player {...this.state} nextTrack={this.nextTrack} togglePlay={this.togglePlay}/>
    </div>
  }
}

class Song extends React.Component {
  static defaultProps = {
    artist: 'UNKNOWN',
    title: 'UNKNOWN',
  }

  play = () => {
    const {play, url, title, itemIndex} = this.props
    play(url, title, itemIndex)
  }
  render() {
    const {artist, title} = this.props
    return <div className="song" onClick={this.play}>
      <span className="artist">{artist}</span>
      <span>-</span>
      <span className="title">{title}</span>
    </div>
  }
}