import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './fillpatientinfo.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Fillpatientinfo extends Component {


  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      patientArr: [],

      renderUI: 0,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    let info = Taro.getSystemInfoSync();

    this.setState({
      screenWidth: info.screenWidth,
    });


    // this.initData();
    // 获取所有患者的列表
    // this.getPatientContactGroups();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.initData();
  }

  componentDidHide() {
  }



  async initData()
  {
    let value = Taro.getStorageSync('CurrentPatient');
    if (value == '')
    {
      this.setState({renderUI: 1}, () => {
        this.getPatientContactGroups();
      });
    }
    else
    {
      // 在这里缓存数据
      Taro.setStorageSync('UserInfo', JSON.stringify( Comm.userData ));

      Comm.currentPatiant = JSON.parse(value);

      Taro.redirectTo({
        url: '/pages/index/index'
      });
    }
  }



  // 获取所有患者的列表
  async getPatientContactGroups()
  {
    let res = await netUtil.get(netUtil.mainUrl + '/getPatientContactGroups');
    // console.log(res);
    if (res.statusCode == 200)
    {
      Comm.currentPatiant = res.data.result[0];
      Taro.setStorageSync('CurrentPatient', JSON.stringify(res.data.result[0]));

      this.setState({patientArr: res.data.result});
    }

    // 通过本地缓存获取当前选择的患者
    // this.getCurrentPatiant();
  }




  render() {
    let {renderUI} = this.state;

    if (renderUI == 1)
    {
      return (
        <View>

          {/* 红色说明 */}
          <View style={{ width: this.state.screenWidth, marginTop: 10 }}>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#BE3758',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 10,
                marginLeft: 10,
                marginRight: 10
              }}>
              <Text style={{color: '#FFF', fontSize: 13}}>重要提示</Text>

              {/* 新增 */}
              {/*<View style={{ position: 'absolute', right: 20, top: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 0 }}*/}
              {/*      onClick={() => {*/}
              {/*        Taro.navigateTo({*/}
              {/*          url: '/pages/addpatient/addpatient'*/}
              {/*        });*/}
              {/*      }}>*/}
              {/*  <AtIcon value='add-circle' size='20' color='#FFF'></AtIcon>*/}
              {/*</View>*/}
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'colume',
                alignItems: 'center',
                backgroundColor: '#F96379',
                padding: 10,
                marginLeft: 10,
                marginRight: 10
              }}>
              <Text style={{color: '#FFF', fontSize: 12}}>本系统使用身份证号唯一识别患者</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'colume',
                alignItems: 'center',
                backgroundColor: '#F96379',
                padding: 10,
                marginLeft: 10,
                marginRight: 10
              }}>
              <Text style={{color: '#FFF', fontSize: 12}}>允许通过多个账号管理同一患者</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'colume',
                alignItems: 'center',
                backgroundColor: '#F96379',
                padding: 10,
                marginLeft: 10,
                marginRight: 10
              }}>
              <Text style={{color: '#FFF', fontSize: 12}}>儿童可使用户口簿上的身份证号码</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'colume',
                alignItems: 'center',
                backgroundColor: '#F96379',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                padding: 10,
                marginLeft: 10,
                marginRight: 10
              }}>
              <Text style={{color: '#FFF', fontSize: 12}}>为了对患者数据进行连续、长期、完整、可关联的存储与使用，避免形成信息孤岛，请重视身份证号的填写</Text>
            </View>

          </View>

          {
            this.state.patientArr.map((item, index) => {
              return(
                <View key={index} style={{ backgroundColor: '#E8E8E8', padding: 10, margin: 10, borderRadius: 10 }}
                      onCLick={() => {
                        Comm.currentPatiant = item;
                        Taro.setStorageSync('CurrentPatient', JSON.stringify(item));

                        // 在这里缓存数据
                        Taro.setStorageSync('UserInfo', JSON.stringify( Comm.userData ));

                        // Taro.redirectTo({
                        //   url: '/pages/index/index'
                        // });

                        Taro.reLaunch({
                          url: '/pages/index/index'
                        });

                      }}>
                  <Text style={{ marginLeft: 10, fontSize: 12 }}>{item.xunshupatient.name}</Text>
                </View>
              );
            })
          }



          <Button
            style={{
              width: this.state.screenWidth - 40,
              backgroundColor: '#3ECCB1',
              color: '#FFF',
              fontSize: 14,
              marginTop: 30,
              marginBottom: 30,
              padding: 5,
              fontWeight: 'bold'
            }}
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/addpatient/addpatient'
              });
            }}
          >添加患者</Button>



        </View>
      )
    }
    else
    {
      return(
        <View></View>
      );
    }

  }


}
