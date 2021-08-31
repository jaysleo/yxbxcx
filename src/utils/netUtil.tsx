import Taro,{getApp} from '@tarojs/taro';
import Comm from '../utils/Comm';
// const hostname = 'http://localhost:3010/';
const hostname = 'https://www.tangfanx.com:3010/';

// const baseUrl = 'http://212.64.50.165';
// const expUrl = 'http://api.ifufan.com:9004';

const timeStr = 1000;
const titleStr = "数据读取中...";

const appjs = getApp();

export default class {

    static hostname =  hostname.substr(0,hostname.length-1);

    // static baseUrl = 'http://212.64.50.165';
    // static expUrl = 'http://api.ifufan.com:9004';
    static mainUrl = 'https://api.ifufan.com:8800'

    /**
     * @author 唐凡
     * @comments isConnected请求
     * @time 2018/12/21 17:08
     * @modification
     * @param:
     *          url:请求地址
     *          data:请求参数
     *          time:loading延迟时间  默认1000
     *          title:loading标题
     */
    static post = (url, data,time=timeStr,title=titleStr) => {
        let flag = true;
        return new Promise((resolve, reject) => {
            setTimeout(()=>
            {
                if(flag)
                {
                    Taro.showLoading({title: title});
                }
            },time);
            // let token = Taro.getStorageSync('userinfo').token;
            // let token = Comm.userData.token;
            let token = Comm.userData ? Comm.userData.token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTg3OTY1NzMsInVzZXJuYW1lIjoieHMxODB4eHh4ODQ4NCJ9.vURqw-2UrWXA_mjL69Ts5vZfEmKl1M8ZSIqKf25A-iY";
            Taro.request({
                // url: hostname + url,
                url: url,
                data: data,
                header: {
                    'Accept': 'application/json, text/plain, */*',
                    "Content-Type": "application/json",
                    'X-Access-Token': token,
                    'Authorization': token,
                },
                method: 'POST',
                dataType: 'json',
            }).then(res => {
                Taro.hideLoading();
                resolve(res);
                flag = false;
                return ;
            }).catch(err => {
                Taro.hideLoading();
                reject(err);
                flag = false;
            });
        });
    };


    /**
     * @author 唐凡
     * @comments GET请求
     * @time 2018/12/25 13:56
     * @modification
     * @param:
     *          url:请求地址
     *          data:请求参数
     *          time:loading延迟时间  默认1000
     *          title:loading标题
     */
    static get = (url, data = {},time=timeStr,title=titleStr) => {
        let flag = true;
        return new Promise((resolve, reject) => {
            if(appjs.isConnected === "N")
            {
                return reject("error:no network connection");
            }
            setTimeout(()=>
            {
                if(flag)
                {
                    Taro.showLoading({title: title});
                }
            },time);
            // let token = Taro.getStorageSync('UserInfo').token;
            // let token = Comm.userData.token;
            let token = Comm.userData ? Comm.userData.token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTg3OTY1NzMsInVzZXJuYW1lIjoieHMxODB4eHh4ODQ4NCJ9.vURqw-2UrWXA_mjL69Ts5vZfEmKl1M8ZSIqKf25A-iY";
            // console.log('url: ', url);
            // console.log('data: ', data);
            Taro.request({
                // url: hostname + url,
                url: url,
                data: data,
                header: token == "" ? {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : {
                    'Accept': 'application/json, text/plain, */*',
                    "Content-Type": "application/json",
                    'X-Access-Token': token,
                    'Authorization': token,
                },
                method: 'GET',
                dataType: 'json',
            }).then(res => {
                Taro.hideLoading();
                resolve(res);
                flag = false;
                return ;
            }).catch(err => {
                Taro.hideLoading();
                reject(err);
                flag = false;
                return ;
            });
        });
    };


    /**
     * @author 唐凡
     * @comments DELETE请求
     * @time 2018/12/25 13:56
     * @modification
     * @param:
     *          url:请求地址
     *          data:请求参数
     *          time:loading延迟时间  默认1000
     *          title:loading标题
     */
    static delete = (url, data,time=timeStr,title=titleStr) => {
        let flag = true;
        return new Promise((resolve, reject) => {
            setTimeout(()=>
            {
                if(flag)
                {
                    Taro.showLoading({title: title});
                }
            },time);
            // let token = Taro.getStorageSync('userinfo').token;
            Taro.request({
                url: hostname + url,
                data: data,
                header: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    // 'Authorization': token
                },
                method: 'DELETE',
                dataType: 'json',
            }).then(res => {
                Taro.hideLoading();
                resolve(res);
                flag = false;
                return ;
            }).catch(err => {
                Taro.hideLoading();
                reject(err);
                flag = false;
                return ;
            });
        });
    };


    /**
     * @author 唐凡
     * @comments PATCH请求
     * @time 2018/12/25 13:57
     * @modification
     * @param:
     *          url:请求地址
     *          data:请求参数
     *          time:loading延迟时间  默认1000
     *          title:loading标题
     */
    static patch = (url, data,time=timeStr,title=titleStr) => {
        let flag = true;
        return new Promise((resolve, reject) => {
            setTimeout(()=>
            {
                if(flag)
                {
                    Taro.showLoading({title: title});
                }
            },time);
            let token = Taro.getStorageSync('userinfo').token;
            Taro.request({
                url: hostname + url,
                data: data,
                header: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                method: 'PUT',
                dataType: 'json',
            }).then(res => {
                Taro.hideLoading();
                resolve(res);
                flag = false;
                return ;
            }).catch(err => {
                Taro.hideLoading();
                reject(err);
                flag = false;
                return ;
            });
        });
    };

}
