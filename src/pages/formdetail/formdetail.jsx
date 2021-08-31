import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './formdetail.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Formdetail extends Component {


  constructor(props) {
    super(props);
    this.state = {
      formArr: [],
      renderForm: -1,

      viewMode: false,
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
    let jsonArr = JSON.parse(Comm.jsonStr);

    if (jsonArr.length > 0)
    {
      this.setState({
        formArr: jsonArr,
        viewMode: getCurrentInstance().router.params.hasOwnProperty('viewmode'),
        renderForm: 1
      });
    }
  }



  // 保存表单数据
  async saveForm()
  {
    let data = {
      "parid": Comm.currentDisease.sjkids,
      // "userid": Comm.userData.userInfo.id,
      "userid": Comm.currentPatiant.xunshupatient.id,
      "typeid": getCurrentInstance().router.params.id,
      "subconfigjson": JSON.stringify(this.state.formArr),
    };

    // let res = await api.saveFormData(data);
    let res = await netUtil.post(netUtil.mainUrl + '/submitdistype', data);
    console.log('data: ', data);
    console.log('res: ', res);

    if (res.data.status == 200)
    {
      Taro.showToast({
        title: res.data.msg,
        icon: 'success',
        duration: 2000
      })

      Taro.navigateBack();
    }
    else
    {
      Taro.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }

    // if (res.status == 200)
    // {
    //   Comm.toast('保存成功');
    //   this.props.navigation.goBack(null);
    // }
  }




  render() {
    return (
      <View style={{ paddingBottom: 30 }}>

        {
          this.state.renderForm == 0 &&
          <View/>
        }

        {
          this.state.renderForm == 1 &&
          <View>
            {
              this.state.formArr.map((item, index) => {

                switch (item.type)
                {
                  case 'text':
                    return(
                      <View key={index} className='formItemNewView'>
                        <Text className='formItemName'>{item.name}</Text>
                        <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
                          <Input type='text' placeholderStyle='color:#878787' confirmType='search'
                                 style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                                 disabled={this.state.viewMode}
                                 value={item.value}
                                 onInput={(e) => {
                                   // this.setState({phone: e.target.value})
                                   let formData = this.state.formArr;
                                   formData[index].value = e.target.value;
                                   this.setState({formArr: formData});
                                 }}
                          />
                        </View>
                      </View>
                    );
                    break;

                  case 'radio':
                    return (
                      <View key={index} className='formItemNewView'>
                        <Text className='formItemName'>{item.name}</Text>
                        <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5, display: 'flex', flexDirection: 'column' }}>
                          {
                            item.option.map((chechItem, cIndex) => {
                              let formData = this.state.formArr;

                              return(
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}
                                      onClick={() => {
                                        if (!this.state.viewMode)
                                        {
                                          formData[index].value = chechItem;
                                          this.setState({formArr: formData});
                                        }
                                      }}>
                                  <AtIcon value='check-circle' size='20' color={chechItem == formData[index].value ? '#3ECCB1' : '#d4d4d4'}></AtIcon>
                                  <Text style={{ fontSize: 12, marginLeft: 10 }}>{chechItem}</Text>
                                </View>
                              );
                            })
                          }
                        </View>
                      </View>
                    );
                    break;

                  case 'www':
                    return(
                      <View key={index} className='formItemNewView'>
                        <Text style={{ color: '#000', fontSize: 14 }}>{item.name}</Text>
                      </View>
                    );
                    break;

                  case 'checkbox':
                    return(
                      <View key={index} className='formItemNewView'>
                        <Text className='formItemName'>{item.name}</Text>
                        <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5, display: 'flex', flexDirection: 'column' }}>
                          {
                            item.option.map((chechItem, cIndex) => {
                              let formData = this.state.formArr;
                              let valueArr = formData[index].value == "" ? [] : formData[index].value;

                              return(
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}
                                      onClick={() => {
                                        if (!this.state.viewMode)
                                        {
                                          if (valueArr.indexOf(chechItem) == -1)
                                            valueArr.push(chechItem);
                                          else
                                            valueArr.splice( valueArr.indexOf(chechItem), 1 );

                                          formData[index].value = valueArr;
                                          this.setState({formArr: formData});
                                        }
                                      }}>
                                  <AtIcon value='check' size='20' color={valueArr.indexOf(chechItem) != -1 ? '#3ECCB1' : '#d4d4d4'}></AtIcon>
                                  <Text style={{ fontSize: 12, marginLeft: 10 }}>{chechItem}</Text>
                                </View>
                              );
                            })
                          }
                        </View>
                      </View>
                    );
                    break;

                }

              })
            }


            {
              !this.state.viewMode &&
              <Button
                style={{
                  width: this.state.screenWidth - 40,
                  marginLeft: 20,
                  marginRight: 20,
                  backgroundColor: '#3ECCB1',
                  color: '#FFF',
                  fontSize: 14,
                  marginTop: 30,
                  padding: 5,
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  this.saveForm();
                }}
              >保存</Button>
            }


          </View>
        }

      </View>
    )
  }
}
