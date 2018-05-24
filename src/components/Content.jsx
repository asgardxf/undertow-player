import React from 'react';

import Album from './Album'


class Content extends React.Component {
  render() {
    const {data} = this.props
    return <div>{
      data.map((item, index) => {
        return <Album description={item.description} path={item.path} key={index} link={item.link} id={item.id}/>
      })
    }</div>
  }
}

export default Content;