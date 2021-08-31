import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Button, Input, Picker} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout, AtInput, AtForm} from 'taro-ui'

import './addpatient.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";


export default class Addpatient extends Component {


  constructor(props) {
    super(props);
    this.state = {
      idcard: '',
      showInfoView: false,

      name: '',
      gender: '请选择',
      age:"",
      height:"",
      weight:"",
      dateSel: '请选择',
      nativeplace:"",
      profession:"",
      phone:"",
      onsetime:"请选择",
      relation: '请选择',
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  // 验证身份证
  async checkIDCard()
  {
    let { idcard } = this.state;
    if (idcard == '')
    {
      Taro.showToast({
        title: '请输入身份证号码',
        icon: 'none',
        duration: 2000
      })
    }



    let res = await netUtil.post(netUtil.mainUrl + '/validateIdcard?idcard=' + idcard);
    // console.log(res);
    if (res.data.success)
    {
      this.setState({showInfoView: true});
    }
    else
    {
      this.setState({showInfoView: false}, () => {
        Taro.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        });
      });
    }

  }



  async savePatient()
  {
    let {idcard, name, gender,age,height,weight, dateSel,nativeplace,profession,phone,onsetime, relation} = this.state;
    if (name == '')
    {
      Taro.showToast({
        title: '请输入名字',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (gender == '请选择')
    {
      Taro.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (age == "")
    {
      Taro.showToast({
        title: '请输入年龄',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (height == "")
    {
      Taro.showToast({
        title: '请输入身高',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (weight == "")
    {
      Taro.showToast({
        title: '请输入体重',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (dateSel == '请选择')
    {
      Taro.showToast({
        title: '请选择生日',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (nativeplace==""){
      Taro.showToast({
        title: '请选择省（市/自治区）',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (profession == ""){
      Taro.showToast({
        title: '请输入职业',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (phone == ""){
      Taro.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (onsetime == "请选择"){
      Taro.showToast({
        title: '请选择首次发作时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (relation == '请选择')
    {
      Taro.showToast({
        title: '请选择关系',
        icon: 'none',
        duration: 2000
      })
      return;
    }


    let data = {
      "name": name,
      "birthday": dateSel,
      "gender": gender,
      "age": age,
      "height": height,
      "weight": weight,
      "nativeplace": nativeplace,
      "phone": phone,
      "onsetime": onsetime,
      "idcard": idcard,
      "relation": relation
    };

    let res = await netUtil.post(netUtil.mainUrl + '/addxunshuPatient', data);
    // console.log('res: ', res);
    if (res.data.success)
    {

      let linkData = {
        "idcard": idcard,
        "relation": relation
      };
      let linkRes = await netUtil.post(netUtil.mainUrl + '/linkPatient', linkData);
      if (linkRes.data.success)
      {
        Taro.showToast({
          title: linkRes.data.message,
          icon: 'success',
          duration: 2000
        });

        Taro.navigateBack();
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
          <Text className='formItemName'>身份证号码</Text>
          <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
            <Input type='text' placeholderStyle='color:#878787' confirmType='search'
                   style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                   value={this.state.idcard}
                   onInput={(e) => {
                     this.setState({idcard: e.detail.value});
                   }}
            />
          </View>
        </View>


        <Button
          style={{
            width: this.state.screenWidth - 40,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: '#3ECCB1',
            color: '#FFF',
            fontSize: 14,
            marginTop: 20,
            padding: 5,
            fontWeight: 'bold'
          }}
          onClick={() => {
            this.checkIDCard();
          }}
        >验证该身份证号</Button>



        {
          this.state.showInfoView &&
          <View style={{ marginTop: 30 }}>

            <View className='formItemNewView'>
              <Text className='formItemName'>患者姓名</Text>
              <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
                <Input type='text' placeholderStyle='color:#878787' confirmType='search'
                       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                       value={this.state.name}
                       onInput={(e) => {
                         this.setState({name: e.detail.value});
                       }}
                />
              </View>
            </View>


            <View className='formItemNewView'>
              <Text className='formItemName'>患者性别</Text>
              <View className='formItemView' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F5F4', borderRadius: 5, height: 45 }}
                    onClick={() => {
                      let _this = this;
                      Taro.showActionSheet({
                        itemList: ['男', '女'],
                        success: function (res) {
                          _this.setState({gender: res.tapIndex == 0 ? '男' : '女'});
                        },
                      })
                    }}>
                <Text className='formItemName'>{this.state.gender}</Text>
              </View>
            </View>

            <View className='formItemNewView'>
              <Text className='formItemName'>患者年龄</Text>
              <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
                <Input type='number' placeholderStyle='color:#878787'
                       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                       value={this.state.age}
                       onInput={(e) => {
                         this.setState({age: e.detail.value});
                       }}
                />
              </View>
            </View>
            <View className='formItemNewView'>
              <Text className='formItemName'>患者身高</Text>
              <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5,display: 'flex', alignItems: 'center' }}>
                <Input type='digit' placeholderStyle='color:#878787'
                       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                       value={this.state.height}
                       onInput={(e) => {
                         this.setState({height: e.detail.value});
                       }}
                />
                <Text style={{color:'#999999'}}>cm</Text>
              </View>
            </View>
            <View className='formItemNewView'>
              <Text className='formItemName'>患者体重</Text>
              <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5,display: 'flex', alignItems: 'center'}}>
                <Input type='digit' placeholderStyle='color:#878787'
                       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                       value={this.state.weight}
                       onInput={(e) => {
                         this.setState({weight: e.detail.value});
                       }}
                />
                <Text style={{color:'#999999'}}>kg</Text>
              </View>
            </View>

            <View className='formItemNewView'>
              <Text className='formItemName'>患者生日</Text>
              <View className='formItemView' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F5F4', borderRadius: 5, height: 45 }}
                    onClick={() => {
                    }}>

                <Picker mode='date'
                        style={{ flex: 1 }}
                        onChange={(e) => {
                          this.setState({ dateSel: e.detail.value });
                        }}>
                  <View className='picker' style={{ flex: 1, fontSize: 12 }}>
                    {this.state.dateSel}
                  </View>
                </Picker>

              </View>
            </View>

            <View className='formItemNewView'>
              <Text className='formItemName'>患者籍贯</Text>
              <View className='formItemView' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F5F4', borderRadius: 5, height: 45 }}
                    onClick={() => {
                    }}>
                <Picker mode='region' value="" style={{ flex: 1 }}
                        onChange={(e) => {
                          this.setState({ nativeplace: e.detail.value[0]+e.detail.value[1] });
                        }}>
                  <View className='picker' style={{ flex: 1, fontSize: 12,height: 45,lineHeight:"45px" }}>{this.state.nativeplace==''?"请选择省（市/自治区）":this.state.nativeplace}</View>
                </Picker>
              </View>
            </View>
            <View className='formItemNewView'>
              <Text className='formItemName'>患者职业</Text>
              <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
                <Input type='text' placeholderStyle='color:#878787'
                       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                       value={this.state.profession}
                       onInput={(e) => {
                         this.setState({profession: e.detail.value});
                       }}
                />
              </View>
            </View>
            <View className='formItemNewView'>
              <Text className='formItemName'>患者联系电话</Text>
              <View className='formItemView' style={{ backgroundColor: '#F3F5F4', borderRadius: 5 }}>
                <Input type='number' placeholderStyle='color:#878787'
                       style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '0px', paddingRight: '0px' }}
                       value={this.state.phone}
                       onInput={(e) => {
                         this.setState({phone: e.detail.value});
                       }}
                />
              </View>
            </View>
            <View className='formItemNewView'>
              <Text className='formItemName'>患者首次发作的时间</Text>
              <View className='formItemView' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F5F4', borderRadius: 5, height: 45 }}
                    onClick={() => {
                    }}>
                <Picker mode='date'
                        style={{ flex: 1 }}
                        onChange={(e) => {
                          this.setState({ onsetime: e.detail.value });
                        }}>
                  <View className='picker' style={{ flex: 1, fontSize: 12 }}>
                    {this.state.onsetime}
                  </View>
                </Picker>
              </View>
            </View>

            <View className='formItemNewView'>
              <Text className='formItemName'>与患者关系</Text>
              <View className='formItemView' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F5F4', borderRadius: 5, height: 45 }}
                    onClick={() => {
                      let _this = this;
                      Taro.showActionSheet({
                        itemList: ['本人', '亲属'],
                        success: function (res) {
                          _this.setState({relation: res.tapIndex == 0 ? '本人' : '亲属'});
                        },
                      })
                    }}>
                <Text className='formItemName'>{this.state.relation}</Text>
              </View>
            </View>


            <Button
              style={{
                width: this.state.screenWidth - 40,
                marginLeft: 20,
                marginRight: 20,
                backgroundColor: '#3ECCB1',
                color: '#FFF',
                fontSize: 14,
                marginTop: 20,
                marginBottom:20,
                padding: 5,
                fontWeight: 'bold'
              }}
              onClick={() => {
                this.savePatient();
              }}
            >保存</Button>


          </View>
        }


      </View>
    )
  }
}
