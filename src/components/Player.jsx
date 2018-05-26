import React from 'react'
import Sound from 'react-sound'

import { Icon } from 'antd'

export default class Player extends React.Component {
  render() {
    const {url, title, isPlaying, nextTrack, prevTrack, togglePlay} = this.props
    return <div className="undertow-player-controls">
      <Sound
        url={url}
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED}
        onFinishedPlaying={nextTrack}
      />
      <div className="buttons">
        <Icon type="fast-backward" onClick={prevTrack}/>
        <Icon type={isPlaying ? "pause-circle" : 'play-circle'} onClick={togglePlay}/>
        <Icon type="fast-forward" onClick={nextTrack}/>
      </div>
      <div className="current-track">
        {title}
      </div>
    </div>
  }
}