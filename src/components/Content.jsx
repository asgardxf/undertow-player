import React from 'react';

import PlayListPreview from './PlayListPreview'


class Content extends React.Component {
  render() {
    const {data} = this.props
    return <div className="main-content">{
      data.map((item, index) => {
        return <PlayListPreview description={item.description} path={item.path} key={index} link={item.link} id={item.id}/>
      })
    }</div>
  }
}

export default Content;