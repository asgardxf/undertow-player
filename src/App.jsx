import React, { Component } from 'react';

//components
import { Layout, Menu } from 'antd';
import AppConent from './components/Content'

//styles
import './App.scss';
import 'antd/dist/antd.css'

const { Header, Content } = Layout;
const url = '/getData/';


console.log('OLOLO', `${Component}`)
class App extends Component {
  state = {
    data: []
  };

  componentDidMount() {
     fetch(url).then(res => res.json())
       .then(res => {
         this.setState({data: res.data})
       })
  }

  render() {
    return (
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1">Player</Menu.Item>
          </Menu>
        </Header>
        <Content>
          <AppConent data={this.state.data}/>
        </Content>
      </Layout>
    )
  }
}

export default App;
