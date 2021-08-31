import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './topic.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Topic extends Component {


  currentTopicID = '';


  avatarArr = [
    'https://hbimg.huabanimg.com/2b124d033cb2d5478d3a4f55c9ee5c10596ae8201225b-cRDZVP_fw658',
    'https://hbimg.huabanimg.com/98bbf5a86420e27294e8f3011e3e0f3783dc0b89deea-FVJQGH_fw658',
    'https://hbimg.huabanimg.com/6d28cfdb0f69acaa5c21651ebfb924a5b796dee646f30-JP2KuL_fw658',
    'https://hbimg.huabanimg.com/2932c0b77cee341f75c87cada39e3177b34489c0118b8-g9qJzZ_fw658',
    'https://hbimg.huabanimg.com/50790d6e8866c18b89bb91855dccd568cbada88931ee-mFhGYX_fw658',
    'https://hbimg.huabanimg.com/d4420395d0ba5a4e6896f82cccf923405b9adf1475bb-6GoqC9_fw658',
  ];


  // state = {
  //   modalVisible: false,
  //   replyContent: '',
  //   topicList: [],
  // }

  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      modalVisible: false,
      replyContent: '',
      topicList: [],
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
    this.getData();
  }

  componentDidHide() {
  }



  async getData()
  {
    let data = {
      "dsid": Comm.currentDisease.id,
      "topicid": "",
      "direction": "new"
    };

    // let res = await netUtil.get(netUtil.baseUrl + '/jeecg-boot/xunshu/shequ/getTopics', data);
    let res = await netUtil.get(netUtil.mainUrl + '/getTopics', data);
    if (res.statusCode == 200)
    {
      // 获取详情
      let count = 0;
      res.data.result.forEach(async item => {
        let paramdata = {
          "topicid": item.id,
          "msgid": "",
          "direction": "new"
        };
        // let detailRes = await netUtil.get(netUtil.baseUrl + '/jeecg-boot/xunshu/shequ/getPastMessagesInTopic', paramdata);
        let detailRes = await netUtil.get(netUtil.mainUrl + '/getPastMessagesInTopic', paramdata);
        item.replys = detailRes.data.result;
        count++;

        if (count == res.data.result.length)
        {
          if (res.data.result.length > 0)
            this.setState({topicList: res.data.result});
        }

      });
    }
  }



  async replyMsg()
  {
    let {replyContent} = this.state;
    if (replyContent == '')
    {
      Taro.showToast({title: '请输入评论', icon: 'none'});
      return;
    }


    this.setState({
      modalVisible: false
    }, () => {
      Taro.showLoading({
        title: '请稍后',
      });
    });


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


    let checkRes = await netUtil.post(netUtil.mainUrl + '/checkmsg', {accesstoken: accessRes.data.data.access_token, content: replyContent});

    if (checkRes.data.data.errcode != 0)
    {
      Taro.hideLoading();
      Taro.showToast({title: '输入内容有敏感信息', icon: 'none'});
      return;
    }


    let res = await netUtil.post(netUtil.mainUrl + '/sendMessge?topicid=' + this.currentTopicID, {"msgContent": this.state.replyContent});

    if (res.statusCode == 200)
    {
      Taro.showToast({
        title: res.data.message,
        icon: 'success',
        duration: 2000
      });

      Taro.hideLoading();

      // this.setState({ modalVisible: false }, () => {
        this.getData();
      // });
    }

  }



  render() {
    return (
      <View>
        <AtList hasBorder={false}>
          {
            this.state.topicList.map((item, index) => {
              return(
                <View key={index}>

                  {/* 头像 */}
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Image style={{width: 50, height: 50, borderRadius: 5}} mode='aspectFill'
                           // src={this.avatarArr[Comm.randRange(0,5)]}
                      src={'https://hbimg.huabanimg.com/50790d6e8866c18b89bb91855dccd568cbada88931ee-mFhGYX_fw658'}
                    />

                    <View style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                      <Text style={{ fontSize: 14, color: '#353c56' }}>{item.sender}</Text>
                      <Text style={{ fontSize: 10, color: '#888888', marginTop: 7 }}>{item.sendTime}</Text>
                    </View>
                  </View>


                  {/* 标题 */}
                  <View style={{ display: 'flex', flexDirection: 'column', marginLeft: 70 }}>
                    <Text style={{ color: '#538EF3', fontSize: 13, fontWeight: 'bold' }}>#{item.title}#</Text>
                    <Text style={{ color: '#000', fontSize: 14, marginTop: 15, marginBottom: 10 }}>{item.msgContent}</Text>
                  </View>


                  {/* 回复按钮 */}
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginRight: 10 }}>
                    <View style={{ width: '100%' }}></View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: 50,
                        fontSize: 11,
                        color: '#353c56',
                        backgroundColor: '#F7F7F7',
                        paddingLeft: 7,
                        paddingRight: 7,
                        fontWeight: 'bold',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        // 检查用户是否已经登录，如果没登录跳转到登录页
                        if (!Comm.userData)
                        {
                          Taro.navigateTo({
                            url: '/pages/login/login'
                          });
                          return;
                        }

                        this.currentTopicID = item.id;
                        this.setState({ modalVisible: true });
                      }}
                    >回复</View>
                  </View>


                  {/* 回复内容 */}
                  {
                    item.replys &&
                    <View style={{ marginRight: 10, marginLeft: 65, marginTop: 5, borderRadius: 5, backgroundColor: '#F7F7F7' }}>
                      {
                        item.replys.map((obj, i) => {
                          return(
                            <View key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomWidth: i != item.replys.length - 1 ? 0.5 : 0, borderBottomColor: '#E9E9E9' }}>
                              <Image src={'https://hbimg.huabanimg.com/50790d6e8866c18b89bb91855dccd568cbada88931ee-mFhGYX_fw658'} style={{ width: 35, height: 35, borderRadius: 5 }} />
                              <View style={{ display: 'flex', flexDirection: 'row', width: this.state.screenWidth - 100 }}>
                                <Text style={{ marginLeft: 5, color: '#353c56', fontSize: 12 }}>{obj.sender}：<Text style={{ color: '#222', fontSize: 12 }}>{obj.msgContent}</Text></Text>
                              </View>
                            </View>
                          );
                        })
                      }
                    </View>
                  }


                </View>
              );
            })
          }
        </AtList>



        {/* 回复 */}
        <AtFloatLayout
          isOpened={this.state.modalVisible}
          title={'回复信息'}
          onClose={() => {
            this.setState({modalVisible: false});
          }}>

          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <View style={{ backgroundColor: '#F3F5F4', width: this.state.screenWidth - 40, borderRadius: 5 }}>
              {/*<Input type='text' placeholder='' placeholderStyle='color:#878787'*/}
              {/*       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: 10, paddingRight: 10 }}*/}
              {/*       // value={this.state.replyContent}*/}
              {/*       // onInput={(e) => {*/}
              {/*       //   this.setState({replyContent: e.target.value})*/}
              {/*       // }}*/}
              {/*/>*/}

              <AtInput
                name='value'
                // style={{ width: this.state.screenWidth - 40 }}
                style={{ width: '100%' }}
                type='text'
                // placeholder='标准五个字'
                value={this.state.replyContent}
                // onChange={this.handleChange.bind(this)}
                onChange={(e) => {
                  this.setState({replyContent: e})
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
              marginTop: 20,
              padding: 5,
              fontWeight: 'bold'
            }}
            onClick={() => {
              this.replyMsg();
            }}
          >确定</Button>

        </AtFloatLayout>



        {/* 新增按钮 */}
        <View
          style={{
            position: 'fixed',
            right: 15,
            bottom: 15,
            borderRadius: 999,
            backgroundColor: '#3ECCB1',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
          }}
          onClick={() => {
            // 检查用户是否已经登录，如果没登录跳转到登录页
            if (!Comm.userData)
            {
              Taro.navigateTo({
                url: '/pages/login/login'
              });
              return;
            }

            Taro.navigateTo({
              url: '/pages/addtopic/addtopic'
            });
          }}>
          <AtIcon value='add' size='20' color='#fff'></AtIcon>
        </View>


      </View>
    )
  }
}
