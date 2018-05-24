import React from 'react'

import {Modal} from 'antd'

const resourcesRoot = 'http://localhost:8000/';

class Album extends React.Component {
  state = {
    modalIsOpen: false,
  }

  references = {}

  toggleModal = () => {
    this.setState(prevState => {
      return {modalIsOpen: !prevState.modalIsOpen}
    })
  }

  loadInfo = () => {
    fetch('/album/' + this.props.id).then(
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
      <img className="cover" src={resourcesRoot + path + '/cover'} onClick={this.loadInfo}/>
      <div className="description" onClick={this.loadInfo}>{description}</div>
      {this.renderModal()}
    </div>
  }

  playNext(index: number) {
    return () => {
      const element = this.references[index+1]
      if (element) {
        element.play()
      }
    }
  }

  renderModal() {
    const {files = []} = this.state.albumInfo || {};
    return <Modal
      visible={this.state.modalIsOpen}
      title="Album view"
      onOk={this.toggleModal}
    >{
      files.map((song, index) => {
        return <audio
          ref={ref => this.references[index] = ref}
          src={encodeURI(resourcesRoot + this.props.path + '/' + song)}
          key={index}
          controls={true}
          onEnded={
            this.playNext(index)
          }
        />
      })
    }</Modal>
  }
}

export default Album