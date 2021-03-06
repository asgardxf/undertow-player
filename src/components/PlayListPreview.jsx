import React from 'react'

import {Modal} from 'antd'

import Playlist from './Playlist'

const resourcesRoot = 'http://localhost:8000/';

class PlayListPreview extends React.Component {
  state = {
    modalIsOpen: false,
    albumInfo: {}
  }


  toggleModal = () => {
    this.setState(prevState => {
      return {modalIsOpen: !prevState.modalIsOpen}
    })
  }

  loadInfo = () => {
    fetch('/playlist/' + this.props.id).then(
      res => res.json()
    ).then(
      json => {
        this.setState({albumInfo: json})
      }
    )
    this.toggleModal()
  }

  render() {
    const {path, description, link} = this.props;
    return <div className="album-preview">
      <p><a href={link}>original post</a></p>
      <img className="cover" src={resourcesRoot + path + '/cover'} onClick={this.loadInfo} alt="playlist"/>
      <div className="description" onClick={this.loadInfo}>{description}</div>
      {this.renderModal()}
    </div>
  }


  renderModal() {
    return <Modal
      visible={this.state.modalIsOpen}
      title="Album view"
      onOk={this.toggleModal}
      destroyOnClose
      width={1000}
    >
      <Playlist
        source={this.state.albumInfo.songs}
        baseUrl={this.props.path}
      />
    </Modal>
  }
}

export default PlayListPreview