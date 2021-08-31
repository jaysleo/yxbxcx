import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Image} from '@tarojs/components'
import {AtButton, AtGrid, AtIcon} from 'taro-ui'

import Comm from '../../utils/Comm';
import netUtil from "../../utils/netUtil";

// import "taro-ui/dist/style/components/button.scss" // 按需引入
import './index.scss'

import icon1 from '../../imgs/icon1.png';
import icon2 from '../../imgs/icon2.png';
import icon3 from '../../imgs/icon3.png';
import icon4 from '../../imgs/icon4.png';
import icon7 from '../../imgs/icon7.png';
import icon8 from '../../imgs/icon8.png';
import iconVTE from '../../imgs/vte.png';


export default class Index extends Component {

  state = {
    screenWidth: 0,
    bannerHeight: 0,

    // bannerArr: [{}, {}, {}],
    bannerArr: [],
    studyList: [],

    devemode: 1,

    // topBanners: [],
  }

  componentWillMount() {
  }

  componentDidMount() {
    // console.log("userData: ", Comm.userData);

    let info = Taro.getSystemInfoSync();

    this.setState({
      screenWidth: info.screenWidth,
      bannerHeight: info.screenWidth * 0.3,
    });

    this.getMode();
    // // 学习资料
    // this.getStudyList();
    // // 获取所有病种
    // this.getXunshuDoctorsjk();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  async getMode()
  {
    let res = await netUtil.get(netUtil.mainUrl + '/developemode');
    this.setState({ devemode: res.data.data[0].propvalue });


    // 检查用户是否登录
    let value = Taro.getStorageSync('UserInfo');
    if (value != '')
      Comm.userData = JSON.parse(value);

    // 检查当前默认选择的患者
    let patientvalue = Taro.getStorageSync('CurrentPatient');
    if (patientvalue != '')
      Comm.currentPatiant = JSON.parse(patientvalue);


    // 学习资料
    this.getStudyList();
    // 获取所有病种
    this.getXunshuDoctorsjk();
  }



  async getStudyList()
  {
    let res = await Taro.request({
      // url: 'http://api.ifufan.com:9004/studylist',
      url: netUtil.mainUrl + '/studylist',
      // data: {"sjkids": "0e12"},
      // data: {"sjkids": "fcf2"},
      // data: {"sjkids": "592f"},
      // data: {"sjkids": "ca3f"},
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



  async getXunshuDoctorsjk()
  {
    let res = await Taro.request({
      // url: netUtil.baseUrl + '/jeecg-boot/xunshu/xunshuDoctorsjk/list',
      url: netUtil.mainUrl + '/xunshuDoctorsjklist',
      data: {"pageSize": 1000},
      header: {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Access-Token': Comm.userData ? Comm.userData.token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTg3OTY1NzMsInVzZXJuYW1lIjoieHMxODB4eHh4ODQ4NCJ9.vURqw-2UrWXA_mjL69Ts5vZfEmKl1M8ZSIqKf25A-iY",
      },
      method: 'GET',
      dataType: 'json',
    });

    console.log('所有病种：', res);
    if (res.statusCode == 200)
    {
      let targetDisease =  res.data.result.records.find(item => item.sjkids == '688a'); // 银屑病：0e12 fcf2 血透：592f //高危 // 血栓
      Comm.currentDisease = targetDisease;

      this.setBanner(Comm.currentDisease);
    }
  }



  async setBanner(item)
  {
    let banerData = [];
    // console.log('item.img1: ', item.img1);
    if (item.img1)
    {
      let obj1 = {
        // url: api.getCover( encodeURIComponent(item.img1) ),
        // url: `${netUtil.mainUrl}/static/${item.img1}`,
        url: `http://212.64.50.165/jeecg-boot/sys/common/static/${item.img1}`,
        path: item.url1 ? item.url1 : ''
      };

      banerData.push(obj1);
    }
    else
    {
      let obj1 =
        {
          url: `https://hbimg.huabanimg.com/fab723b7f653b787fd875d6333477fe6433f74395231c-WGjo6E_fw658`,
          path: 'https://www.yebaike.com/22/280174.html',
        };

      banerData.push(obj1);
    }

    if (item.img2)
    {
      let obj2 = {
        // url: api.getCover( encodeURIComponent(item.img2) ),
        url: `http://212.64.50.165/jeecg-boot/sys/common/static/${item.img2}`,
        path: item.url2 ? item.url2 : ''
      };

      banerData.push(obj2);
    }
    if (item.img3)
    {
      let obj3 = {
        // url: api.getCover( encodeURIComponent(item.img3) ),
        url: `http://212.64.50.165/jeecg-boot/sys/common/static/${item.img3}`,
        path: item.utl3 ? item.utl3 : ''
      };

      banerData.push(obj3);
    }
    // console.log(banerData);
    this.setState({ bannerArr: banerData });
  }



  // 检查用户是否已经登录，如果没登录跳转到登录页
  checkUserIsLogin()
  {
    // console.log(Comm.userData);
    if (!Comm.userData)
    {
      Taro.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }


    if (!Comm.currentPatiant)
    {
      Taro.navigateTo({
        url: '/pages/fillpatientinfo/fillpatientinfo'
      });
      return;
    }

  }



  render() {
    return (
      <View>

        {/* 顶部入口 */}
        <View style={{marginTop: '10PX'}}>
          <AtGrid
            hasBorder={false}
            columnNum={4}
            onClick={(e) => {
              if (e.value == '病友经验')
              {
                Taro.navigateTo({
                  url: '/pages/topic/topic'
                });
              }
              else if (e.value == '学习')
              {
                Taro.navigateTo({
                  url: '/pages/study/study'
                });
              }
              else if (e.value == '问卷记录')
              {
                Taro.navigateTo({
                  url: '/pages/formrecord/formrecord'
                });
              }
              else if (e.value == '记录数据')
              {
                Taro.navigateTo({
                  url: '/pages/formlist/formlist'
                });
              }
              else if (e.value == '记录历史')
              {
                this.checkUserIsLogin();
                Taro.navigateTo({
                  // url: '/pages/formlist/formlist'
                  url: '/pages/formrecord/formrecord'
                });
              }
              else if (e.value == '咨询医生')
              {
                this.checkUserIsLogin();
                Taro.navigateTo({
                  url: '/pages/chat/chat'
                });
              }
              else if (e.value == '评估问卷')
              {

                // if (this.state.devemode == 0)
                // {
                this.checkUserIsLogin();
                  Taro.navigateTo({
                    url: '/pages/webViewer/webViewer?url=' + 'https://api.ifufan.com/yxb/list.html'
                  });
                // }
                // else
                // {
                //   Taro.navigateTo({
                //     url: '/pages/formlist/formlist'
                //   });
                // }

              }
              else if (e.value == '病历夹')
              {
                // Taro.navigateTo({
                //   url: '/pages/formblj/formblj'
                // });

                this.checkUserIsLogin();
                Taro.navigateTo({
                  url: '/pages/webViewer/webViewer?url=' + 'https://api.ifufan.com/yxb/bljlist.html'
                });

              }
              else if (e.value == '切换患者')
              {
                this.checkUserIsLogin();
                Taro.navigateTo({
                  url: '/pages/changepatient/changepatient'
                });
              }
              else if (e.value == 'VTE评估')
              {

                Taro.navigateToMiniProgram({
                  appId: 'wxc3ec23f6297776f3',
                  path: 'pages/index/index',
                  envVersion: 'release',//跳转到b的正式版
                });

              }

              else if (e.value == 'Web')
              {
                Taro.navigateTo({
                  url: '/pages/webViewer/webViewer?url=' + 'https://api.ifufan.com/yxb/bljlist.html'
                  // url: '/pages/webViewer/webViewer?url=' + 'http://103.66.217.156:81/list.html'
                });
              }


            }}
            data={
              this.state.devemode == 0
                ?
                [
                  {
                    image: icon1,
                    value: '病历夹'
                  },
                  {
                    image: icon2,
                    value: '病友经验'
                  },
                  {
                    image: icon3,
                    value: '咨询医生'
                  },
                  {
                    image: icon4,
                    value: '学习'
                  },
                  {
                    image: icon8,
                    value: '评估问卷'
                  },
                  {
                    image: iconVTE,
                    value: 'VTE评估'
                  },
                  {
                    image: icon7,
                    value: '切换患者'
                  },
                  // {
                  //   image: icon3,
                  //   value: 'Web'
                  // },
                ]
                :
                [
                  {
                    image: icon1,
                    value: '记录数据'
                  },
                  {
                    image: icon3,
                    value: '记录历史'
                  },
                  // {
                  //   image: icon2,
                  //   value: '病友经验'
                  // },
                  {
                    image: icon4,
                    value: '学习'
                  },
                  {
                    image: icon7,
                    value: '切换患者'
                  },
                  // {
                  //   image: iconVTE,
                  //   value: 'VTE评估'
                  // },
                  // {
                  //   image: icon3,
                  //   value: '咨询医生'
                  // },
                  // {
                  //   image: icon3,
                  //   value: 'Web'
                  // },
                ]
            }/>
        </View>


        {/* Banner */}
        <View style={{marginTop: '10PX'}}>
          <Swiper
            style={{width: this.state.screenWidth, height: this.state.bannerHeight}}
            indicatorColor='#999'
            indicatorActiveColor='#3ECCB2'
            circular
            indicatorDots
            // current={this.state.bannerPicIndex}
            // onChange={e => {
            //     console.log(e);
            //     if (e.detail.source == "touch") {
            //         this.setState({
            //             bannerPicIndex: e.detail.current
            //         })
            //     }x
            // }}
          >
            {
              this.state.bannerArr.map((item, index) => {
                return (
                  <SwiperItem key={index} style={{width: this.state.screenWidth, height: this.state.bannerHeight}}
                              onClick={() => {
                                if (item.url != '')
                                {
                                  Taro.navigateTo({
                                    // url: '/pages/webViewer/webViewer?url=' + item.url
                                    url: '/pages/webViewer/webViewer?url=' + 'https://mp.weixin.qq.com/s/Y6GofFZhCFYpyQdt9Wk0pQ'
                                  });
                                }
                              }}>
                    <View className='at-row at-row__justify--center'>
                      <Image style={{width: this.state.screenWidth - 20, height: this.state.bannerHeight, borderRadius: 10, marginLeft: 10}} mode='aspectFill'
                             // src={'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3048047842,2160415075&fm=26&gp=0.jpg'}
                             src={item.url}
                      />
                    </View>
                  </SwiperItem>
                );
              })
            }
          </Swiper>
        </View>


        {/* 消息提示 */}
        <View style={{ marginTop: 10, borderRadius: 10, width: this.state.screenWidth }}>
          <View style={{ backgroundColor: '#F8F8F8', borderRadius: 10, width: this.state.screenWidth - 40, margin: 10, padding: 10 }}
                onClick={() => {
                  Taro.navigateTo({
                    url: '/pages/study/study'
                  });
                }}>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={{ fontSize: 13 }}>·助您快速掌握相关知识</Text>
                <Text style={{ fontSize: 13 }}>·更多学习资料请点击查看</Text>
              </View>

              <AtIcon value='chevron-right' size='20' color='#B8C5C3'></AtIcon>
            </View>

          </View>
        </View>


        {/* 学习列表 */}
        <View style={{margintop: 10, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', paddingBottom: 50}}>

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
                  }}>

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
