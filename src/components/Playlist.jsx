import React from 'react'
import {Table, Button} from 'antd'

import Player from './Player'
const resourcesRoot = 'http://localhost:8000/';

function scrobble(artist, track) {
  return fetch('/scrobble/', {
    method: 'POST', credentials: 'include', body: JSON.stringify({artist, track})
  })
}


export default class Playlist extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isPlaying: false,
      columns: [
        {
          key:'playButton', render: (text, record, index) => {
            return <PlayButton
              itemIndex={index}
              url={text}
              title={record.attributes.title}
              play={this.play}
            />
          }, dataIndex: 'path'
        },
        {title: 'Artist', key: 'artist', dataIndex: 'attributes.artist'},
        {title: 'Title', key: 'title', dataIndex: 'attributes.title'},
      ]
    }

  }

  updatePlayerState = (index, additionalUpdates) => {
    const song = this.props.source[index]
    if (!song) {
      this.setState({isPlaying:false})
      return
    }
    const {artist, title} = song.attributes
    scrobble(artist, title)
    this.setState({
      title,
      url: resourcesRoot + this.props.baseUrl + '/' + encodeURIComponent(song.path),
      currentIndex: index,
      ...additionalUpdates,
    })
  }

  play = (index) => {
    this.updatePlayerState(index, {isPlaying: true})
  }

  nextTrack = () => {
    const {currentIndex} = this.state
    this.updatePlayerState(currentIndex + 1)
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
      <Table
        columns={this.state.columns}
        dataSource={source}
        pagination={false}
        rowKey="id"
      />
      <br/>
      <Player {...this.state} nextTrack={this.nextTrack} togglePlay={this.togglePlay}/>
    </div>
  }
}

class PlayButton extends React.Component {

  play = () => {
    const {play, itemIndex} = this.props
    play(itemIndex)
  }
  render() {
    return <Button
      icon="caret-right"
      onClick={this.play}
    />
  }//
}