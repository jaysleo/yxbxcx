// import Taro from '@tarojs/taro'
import {Component} from 'react'
import './app.scss'
// import netUtil from "./utils/netUtil";
// import Comm from "./utils/Comm";

class App extends Component {

  componentDidMount() {
    // this.initApp();
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }


  // async initApp()
  // {
  //   // 获取轮询延迟
  //   let res = await Taro.request({
  //     url: netUtil.mainUrl + '/config',
  //     header: {
  //       'Accept': '*/*',
  //       'Content-Type': 'application/json;charset=UTF-8',
  //     },
  //     method: 'GET',
  //     dataType: 'json',
  //   });
  //
  //   console.log('res: ', res);
  //
  //   if (res.data.code == 200)
  //     Comm.polldelayValue = res.data.data[0].propvalue;
  //   else
  //     Comm.polldelayValue = 5;
  //
  //
  //   // 开始轮训获取聊天数据
  //   // setInterval(() => {
  //   //   // this.getChatMsgDatas();
  //   //   console.log('chat')
  //   // }, Comm.polldelayValue * 1000);
  // }




  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App
