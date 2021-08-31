import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Image} from '@tarojs/components'
import {AtButton, AtGrid, AtIcon} from 'taro-ui'

import Comm from '../../utils/Comm';
import netUtil from "../../utils/netUtil";

import './study.scss'


export default class Study extends Component {

  state = {
    screenWidth: 0,
    bannerHeight: 0,

    studyList: [],
  }

  componentWillMount() {
  }

  componentDidMount() {
    let info = Taro.getSystemInfoSync();

    this.setState({
      screenWidth: info.screenWidth,
      bannerHeight: info.screenWidth * 0.3,
    });

    // 学习资料
    this.getStudyList();
    // 获取所有病种
    // this.getXunshuDoctorsjk();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  async getStudyList()
  {
    // console.log(Comm.currentDisease.sjkids)
    let res = await Taro.request({
      // url: 'http://api.ifufan.com:9004/studylist',
      url: netUtil.mainUrl + '/studylist',
      // data: {"sjkids": "0e12"},
      // data: {"sjkids": 'fcf2'},
      // data: {"sjkids": "592f"},
      // data: {"sjkids": "595f"},
      data: {"sjkids": "688a"},
      header: {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
      dataType: 'json',
    });


    if (res.statusCode == 200)
    {
      this.setState({studyList: res.data.data});
    }

  }



  // async getXunshuDoctorsjk()
  // {
  //   let res = await Taro.request({
  //     // url: netUtil.baseUrl + '/jeecg-boot/xunshu/xunshuDoctorsjk/list',
  //     url: netUtil.mainUrl + '/xunshuDoctorsjklist',
  //     data: {"pageSize": 1000},
  //     header: {
  //       'Accept': '*/*',
  //       'Content-Type': 'application/json;charset=UTF-8',
  //       'X-Access-Token': Comm.userData ? Comm.userData.token : '',
  //     },
  //     method: 'GET',
  //     dataType: 'json',
  //   });
  //
  //   if (res.statusCode == 200)
  //   {
  //     let targetDisease =  res.data.result.records.find(item => item.sjkids == '0e12');
  //     Comm.currentDisease = targetDisease;
  //   }
  // }



  render() {
    return (
      <View>

        {/* 学习列表 */}
        <View style={{margintop: 10, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>

          {
            this.state.studyList.map((item, index) => {
              return (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: (this.state.screenWidth - 30) * 0.5,
                    // height: (this.state.screenWidth - 30) * 0.5,
                    paddingLeft: 10,
                    paddingBottom: 10,
                  }}
                  onClick={() => {
                    if (item.url != '')
                    {
                      // console.log(item);
                      Taro.navigateTo({
                        url: '/pages/webViewer/webViewer?url=' + item.url
                      });
                    }
                  }}
                >

                  <Image
                    style={{
                      width: (this.state.screenWidth - 30) * 0.5,
                      // height: (this.state.screenWidth - 30) * 0.5
                    }}
                    mode='aspectFill'
                    src={item.img}/>


                  <Text style={{fontSize: 12, marginTop: 10}}>{item.title}</Text>

                </View>

              );
            })
          }

        </View>

      </View>


      // </View>
    )
  }
}
