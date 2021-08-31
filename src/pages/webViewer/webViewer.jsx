import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Image, ScrollView, Button, WebView} from '@tarojs/components'
import {AtButton, AtIcon, AtTabs, AtTabsPane} from 'taro-ui'

import './webViewer.scss'
import netUtil from "../../utils/netUtil";
import Comm from '../../utils/Comm';

export default class WebViewer extends Component {

    state = {
        screenWidth: 0,
        bannerHeight: 0,

        url: '',
    }

    componentWillMount() {
    }

    componentDidMount() {
        let info = Taro.getSystemInfoSync();

        let uid = getCurrentInstance().router.params.url + '?v=1';
        if (Comm.currentPatiant)
        {
          if (Comm.currentPatiant.xunshupatient)
          {
            uid += '&uid=' + Comm.currentPatiant.xunshupatient.id;
          }
        }

        // 添加token
        if (Comm.userData)
        {
            uid += '&token=' + Comm.userData.token;
        }


        this.setState({
            screenWidth: info.screenWidth,
            bannerHeight: info.screenWidth * 0.55,
            // url: getCurrentInstance().router.params.url
            // url: getCurrentInstance().router.params.url + '?uid=' + Comm.currentPatiant.xunshupatient.id
            url: uid
        });
    }

    componentWillUnmount() {
    }

    componentDidShow() {
    }

    componentDidHide() {
    }




    render() {

        return (
            <WebView src={this.state.url} />
        )
    }
}
