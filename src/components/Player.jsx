import React from 'react'

import { Icon } from 'antd'

export default class Player extends React.Component {

  saveAudio = audio => this.audio = audio

  componentDidMount() {
    this.audio.addEventListener('ended', () => {
      this.props.nextTrack()
    })
  }

  componentDidUpdate(oldProps) {
    if (this.props.isPlaying && !oldProps.isPlaying) {
      this.audio.play()
    }

    if (!this.props.isPlaying && oldProps.isPlaying) {
      this.audio.pause()
    }
    if (this.props.url !== oldProps.url && this.props.isPlaying) {
      this.audio.play()
    }
  }



  render() {
    const {url, title} = this.props
    return <div className="undertow-player-controls">
      <audio
        src={url}
        ref={this.saveAudio}
        controls
      />
      <div className="current-track">
        {title}
      </div>
    </div>
  }
}