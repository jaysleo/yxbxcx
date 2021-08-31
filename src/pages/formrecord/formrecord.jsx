import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './formrecord.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Formrecord extends Component {


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
    // console.log('Comm.currentDisease.sjkids: ', Comm.currentDisease.sjkids);
    let data = {
      // "parid": Comm.currentDisease.sjkids,
      "parid": '0e12',
    };

    let res = await netUtil.post(netUtil.mainUrl + '/selectdistype', data);
    // console.log('res: ', res);
    if (res.statusCode == 200)
    {
      if (res.data.data.length > 0)
      {
        this.setState({ originalFormList: res.data.data }, () => {
          this.getData();
        });
      }
    }
  }



  // 获取所有表单
  async getData()
  {
    let data = {
      // "parid": Comm.currentDisease.sjkids,
      "parid": '0e12',
      "userid": Comm.currentPatiant.xunshupatient.id,
    };

    let res = await netUtil.post(netUtil.mainUrl + '/searchsubmittype', data);
    // console.log('this.state.originalFormList: ', this.state.originalFormList)
    // console.log('res:', res);
    if (res.statusCode == 200)
    {
      if (res.data.data.length > 0 && this.state.originalFormList.length > 0)
      {
        let len = res.data.data.length;
        for (let i = 0; i < len; i++)
        {
          let formItem = this.state.originalFormList.find(item => item.id == res.data.data[i].typeid);
          if (formItem)
            res.data.data[i].formname = formItem.formname;
          else
            res.data.data[i].formname = "";

          let showDate = new Date( parseInt(res.data.data[i].adddatetime) );
          res.data.data[i].showtime = showDate.getFullYear() + '-' + showDate.getMonth() + 1 + '-' + showDate.getDate() + ' ' + showDate.getHours() + ':' + showDate.getMinutes();
        }

        this.setState({ formList: res.data.data });
      }
    }
  }



  render() {
    return (
      <View>

        {
          this.state.formList.map((item, index) => {
            return(
              <View key={index} style={{display: 'flex', flexDirection: 'column', backgroundColor: '#f8f8f8', padding: 10 }}
                    onClick={() => {
                      // let paramJson = item.subconfigjson.replace(/%/g, '%25');
                      Comm.jsonStr = item.subconfigjson.replace(/%/g, '%25');
                      Taro.navigateTo({
                        // url: '/pages/formdetail/formdetail?data=' + paramJson + '&id=' + item.id
                        url: '/pages/formdetail/formdetail?id=' + item.id + '&viewmode=1'
                      });
                    }}>
                <Text style={{fontSize: 12}}>{item.formname}</Text>

                <Text style={{ fontSize: 10, color: '#888' }}>填写时间：{item.showtime}</Text>
              </View>
            );
          })
        }

      </View>
    )
  }
}
