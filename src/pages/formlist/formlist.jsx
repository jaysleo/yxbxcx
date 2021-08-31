import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './formlist.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Formlist extends Component {


  constructor(props) {
    super(props);
    this.state = {
      originalFormList: [],
      formList: [],
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getAllForm();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  // 先获取所有表单
  async getAllForm()
  {
    let data = {
      // "parid": Comm.currentDisease.sjkids,
      "parid": '226',
    };

    let res = await netUtil.post(netUtil.mainUrl + '/selectdistype', data);
    if (res.statusCode == 200)
    {
      if (res.data.data.length > 0)
      {
        this.setState({ originalFormList: res.data.data });
      }
    }



    // let dataArr = [];
    //
    // let res1 = await netUtil.post(netUtil.mainUrl + '/selectdistype', {"parid": '225'});
    // if (res1.statusCode == 200)
    //   dataArr.push( res1.data.data[0] );
    // // let res2 = await netUtil.post(netUtil.mainUrl + '/selectdistype', {"parid": '999'});
    // // if (res2.statusCode == 200)
    // //   dataArr.push( res2.data.data[0] );
    // //
    // // let res3 = await netUtil.post(netUtil.mainUrl + '/selectdistype', {"parid": '222'});
    // // if (res3.statusCode == 200)
    // //   dataArr.push( res3.data.data[0] );
    // //
    // // let res4 = await netUtil.post(netUtil.mainUrl + '/selectdistype', {"parid": '223'});
    // // if (res4.statusCode == 200)
    // //   dataArr.push( res4.data.data[0] );
    //
    // this.setState({ originalFormList: dataArr });

  }




  render() {
    return (
      <View>

        {
          this.state.originalFormList.map((item, index) => {
            return(
              <View key={index} style={{display: 'flex', flexDirection: 'column', backgroundColor: '#f8f8f8', padding: 10, paddingTop: 15, paddingBottom: 15 }}
                    onClick={() => {
                      // 检查用户是否已经登录，如果没登录跳转到登录页
                      if (!Comm.userData)
                      {
                        Taro.navigateTo({
                          url: '/pages/login/login'
                        });
                        return;
                      }

                      Comm.jsonStr = item.configjson.replace(/%/g, '%25');
                      // Comm.jsonStr = item.configjson;
                      Taro.navigateTo({
                        // url: '/pages/formdetail/formdetail?data=' + item.configjson
                        url: '/pages/formdetail/formdetail?id=' + item.id
                      });
                    }}>
                <Text style={{fontSize: 12}}>{item.formname}</Text>

                {/*<Text style={{ fontSize: 10, color: '#888' }}>填写时间：{item.showtime}</Text>*/}
              </View>
            );
          })
        }

      </View>
    )
  }
}
