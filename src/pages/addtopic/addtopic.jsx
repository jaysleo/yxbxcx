import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input, Textarea} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './addtopic.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Addtopic extends Component {


  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      title: '',
      msgContent: '',
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    let info = Taro.getSystemInfoSync();

    this.setState({
      screenWidth: info.screenWidth,
    });

  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  async addTopic()
  {
    let {title, msgContent} = this.state;
    if (title == '')
    {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (msgContent == '')
    {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }



    // 检查内容是否有敏感词
    let accessRes = await netUtil.get(netUtil.mainUrl + '/getAccessToken');
    // 肺栓塞
    // let data = {
    //   "appid": 'wx61c3466ab6b28570',
    //   "secret": '1982493bd8f4fd5e6e1983f8581a77c6',
    // };
    // let accessRes = await netUtil.get(netUtil.mainUrl + '/getAccessTokenByID', data);

    // 血透
    // let data = {
    //   "appid": 'wx4c1a0713a1a7b084',
    //   "secret": '1125a70653497da7df9f71a64fd1b9d6',
    // };
    // let accessRes = await netUtil.get(netUtil.mainUrl + '/getAccessTokenByID', data);

    let checkRes = await netUtil.post(netUtil.mainUrl + '/checkmsg', {accesstoken: accessRes.data.data.access_token, content: title});
    if (checkRes.data.data.errcode != 0)
    {
      Taro.hideLoading();
      Taro.showToast({title: '输入内容有敏感信息', icon: 'none'});
      return;
    }

    let checkRes2 = await netUtil.post(netUtil.mainUrl + '/checkmsg', {accesstoken: accessRes.data.data.access_token, content: msgContent});
    if (checkRes2.data.data.errcode != 0)
    {
      Taro.hideLoading();
      Taro.showToast({title: '输入内容有敏感信息', icon: 'none'});
      return;
    }



    let data = {
      "dsid": Comm.currentDisease.id,
      "title": title,
      "msgContent": msgContent
    };
    let res = await netUtil.post(netUtil.mainUrl + '/newTopic', data);
    // console.log(res);
    if (res.data.success)
    {
      Taro.navigateBack();

      Taro.showToast({
        title: res.data.message,
        icon: 'success',
        duration: 2000
      });
    }
    else
    {
      Taro.showToast({
        title: res.data.message,
        icon: 'none',
        duration: 2000
      });
    }
  }




  render() {
    return (
      <View>

        <View className='formItemNewView'>
          <Text className='formItemName'>标题</Text>
          <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
            <Input type='text' placeholderStyle='color:#878787' confirmType='search'
                   style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                   value={this.state.title}
                   onInput={(e) => {
                     this.setState({title: e.detail.value});
                   }}
            />
          </View>
        </View>


        <View className='formItemNewView'>
          <Text className='formItemName'>内容</Text>
          <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5, padding: 10 }}>
            <Textarea type='text' placeholderStyle='color:#878787' confirmType='search' maxlength={200}
                   style={{ fontSize: '12px', width: '100%', height: 100, paddingLeft: '0px', paddingRight: '0px' }}
                   value={this.state.msgContent}
                   onInput={(e) => {
                     this.setState({msgContent: e.detail.value});
                   }}
            />
          </View>
        </View>


        <Button
          style={{
            width: this.state.screenWidth - 40,
            backgroundColor: '#3ECCB1',
            color: '#FFF',
            fontSize: 14,
            marginTop: 30,
            padding: 5,
            fontWeight: 'bold'
          }}
          onClick={() => {
            this.addTopic();
          }}
        >提交</Button>

      </View>
    )
  }
}
