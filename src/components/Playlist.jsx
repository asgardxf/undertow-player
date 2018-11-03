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
    const {play, url, title, itemIndex} = this.props
    play(url, title, itemIndex)
  }
  render() {
    return <Button
      icon="caret-right"
      onClick={this.play}
    />
  }
}