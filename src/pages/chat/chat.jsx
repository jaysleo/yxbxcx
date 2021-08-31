import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './chat.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Chat extends Component {


  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      msgList: [],
      sendTxt: '',
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    let info = Taro.getSystemInfoSync();

    this.setState({
      screenWidth: info.screenWidth,
    });


    this.getChatMsg();
    setInterval(() => {
      this.getChatMsg();
    }, 5000);
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  async getChatMsg()
  {
    let data = {
      "senderid": Comm.currentPatiant.xunshupatient.id,
      "receiverid": Comm.currentDisease.id
    };

    let res = await netUtil.get(netUtil.mainUrl + '/chat', data);
    if ( res.data.code == 200 && res.data.data.length != this.state.msgList.length )
    {
      res.data.data.forEach(item => {
        item.isMine = item.senderid == Comm.currentPatiant.xunshupatient.id;
      });

      this.setState({
        msgList: res.data.data
      }, () => {
        setTimeout(() => {
          Taro.pageScrollTo({
            scrollTop: 9999,
            duration: 0
          })
        }, 100);
      });

    }
  }



  // 发送信息
  async sendMsg()
  {
    let {sendTxt} = this.state;
    if ( sendTxt != '' )
    {
      let id = (new Date()).valueOf().toString();
      let data = {
        "id": id,
        "senderid": Comm.currentPatiant.xunshupatient.id,
        "sendername": Comm.currentPatiant.xunshupatient.name,
        "receiverid": Comm.currentDisease.id,
        "receivername": Comm.currentDisease.doctorname,
        "msg": sendTxt
      };

      // console.log(data);

      // let res = await api.sendMsg(id, Comm.currentPatiant.xunshupatient.id, Comm.currentPatiant.xunshupatient.name, Comm.currentDisease.id, Comm.currentDisease.doctorname, senderTxt);
      let res = await netUtil.post(netUtil.mainUrl + '/chat', data);
      // console.log('res: ', res);
      if (res.data.code == 200)
      {
        let newMsg = {id: id, isMine: true, msg: sendTxt};
      //   this.rowCount ++ ;
      //   this.setState({ msgList: [...[newMsg], ...this.state.msgList], sendTxt: '' }, () => {
        this.setState({ msgList: [...this.state.msgList, ...[newMsg]], sendTxt: '' }, () => {
      //     Comm.msgData.unshift(newMsg);
      //     Comm.msgIDs.push(id);
      //     if (this.state.msgList.length > 2)
      //     {
      //       this.msglistComp.scrollToIndex({index: 1, animated: false});
      //       setTimeout(() => {
      //         this.msglistComp.scrollToIndex({index: 0, animated: true});
      //       }, 100);
      //     }

          setTimeout(() => {
            Taro.pageScrollTo({
              scrollTop: 9999,
              duration: 0
            })
          }, 100);

        });
      }
      else
      {
        Taro.showToast({
          title: '发送失败，请稍后重试',
          icon: 'success',
          duration: 2000
        });
      }

    }
  }




  render() {
    return (
      <View style={{ paddingBottom: 70 }}>
        <AtList hasBorder={false}>

          {
            this.state.msgList.map((item, index) => {
              return(
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    paddingTop: 10,
                    // paddingLeft: 10,
                    // paddingRight: 10,
                    justifyContent: item.isMine ? 'flex-end' : 'flex-start',
                    // backgroundColor: '#f8f8f8',
                  }}>

                  <View
                    style={{
                      backgroundColor: item.isMine ? '#45D0B9' : '#f8f8f8',
                      borderRadius: 5,
                      paddingLeft: 15,
                      paddingRight: 15,
                      paddingTop: 9,
                      paddingBottom: 10,
                      marginLeft: item.isMine ? 0 : 10,
                      marginRight: item.isMine ? 10 : 0,
                    }}>
                    <Text style={{ fontSize: 15, color: '#000' }}>{item.msg}</Text>
                  </View>

                </View>
              );
            })
          }

        </AtList>


        <View style={{ position: 'fixed', bottom: 0, width: this.state.screenWidth, backgroundColor: '#FFF', display: 'flex', flexDirection: 'row', padding: 10, paddingTop: 5, paddingBottom: 10 }}>

          <View style={{ backgroundColor: '#f8f8f8', width: this.state.screenWidth - 40, paddingLeft: 10, paddingRight: 10 }}>
            <Input type='text' placeholderStyle='color:#878787'
                   style={{ fontSize: 14, width: '100%', height: 40 }}
                   onConfirm={() => this.sendMsg() }
                   value={this.state.sendTxt}
                   onInput={(e) => {
                     this.setState({sendTxt: e.target.value})
                   }}
            />
          </View>

        </View>


      </View>
    )
  }
}
