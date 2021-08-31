import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Input, Button} from '@tarojs/components'
import {AtButton, AtIcon, AtList, AtListItem, AtFloatLayout} from 'taro-ui'

import './login.scss'
import netUtil from "../../utils/netUtil";
import Comm from "../../utils/Comm";

import bgCover from '../../imgs/loginCover.png';


export default class Login extends Component {

  state = {
    screenWidth: 0,
    agreementModal: false,
    phone: '',
    code: '',

    renderUI: -1,
  }

  componentWillMount() {
  }

  componentDidMount() {
    let info = Taro.getSystemInfoSync();

    this.setState({
      screenWidth: info.screenWidth,
      agreementModal: true,
    });

    this.initData();
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }



  async initData()
  {
    let value = Taro.getStorageSync('UserInfo');
    if (value == '')
    {
      this.setState({renderUI: 1});
    }
    else
    {
      Comm.userData = JSON.parse(value);

      Taro.redirectTo({
        // url: '/pages/index/index'
        url: '/pages/fillpatientinfo/fillpatientinfo'
      });
    }

  }



  // 发送验证码
  async sendSMS()
  {
    let {phone} = this.state;
    if (phone == '')
    {
      Taro.showModal({
        title: '错误',
        content: '请输入手机号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return;
    }


    let data = {
      "mobile": phone,
      "smsmode": "0"
    };

    let res = await Taro.request({
      // url: netUtil.baseUrl + '/jeecg-boot/sys/sms',
      url: netUtil.mainUrl + '/sms',
      data: data,
      header: {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      dataType: 'json',
    });

    if (res.statusCode == 200)
    {
      Taro.showToast({
        title: res.data.message,
        icon: 'success',
        duration: 2000
      });
    }
  }



  // 登录
  async onLogin()
  {
    let {phone, code} = this.state;
    if (phone == '' || code == '')
    {
      Taro.showModal({
        title: '错误',
        content: '账号或密码不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
      return;
    }


    let data = {
      "captcha": code,
      "mobile": phone,
      "remember_me": true
    };

    let res = await Taro.request({
      // url: netUtil.baseUrl + '/jeecg-boot/sys/phoneLogin',
      url: netUtil.mainUrl + '/phoneLogin',
      data: data,
      header: {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      dataType: 'json',
    });

    // console.log(res);

    if (res.statusCode == 200)
    {
      if (res.data.code == 200)
      {
        res.data.result.userInfo.token = res.data.result.token;
        Comm.userData = res.data.result.userInfo;

        // 先屏蔽这里，不然如果用户在选人页面返回，就卡死了
        // Taro.setStorageSync('UserInfo', JSON.stringify( Comm.userData ));


        Taro.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        });

        Taro.redirectTo({
          // url: '/pages/index/index'
          url: '/pages/fillpatientinfo/fillpatientinfo'
        });
      }
    }

  }




  render() {
    let {renderUI} = this.state;
    if (renderUI == 1)
    {
      return (
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Image style={{width: this.state.screenWidth - 100 }} mode='widthFix' src={bgCover}/>
          </View>

          {/* 血栓全程管理 血栓全程管理 */}
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>血栓全程管理</Text>
          </View>


          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <View style={{ backgroundColor: '#F3F5F4', width: this.state.screenWidth - 40, borderRadius: 5 }}>
              <Input type='number' placeholder='手机号' placeholderStyle='color:#878787' confirmType='search'
                     style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '15px', paddingRight: '15px' }}
                // onConfirm={() => this.onSearch() }
                     maxlength={11}
                     value={this.state.phone}
                     onInput={(e) => {
                       this.setState({phone: e.target.value})
                     }}
              />
            </View>
          </View>


          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F3F5F4', width: this.state.screenWidth - 40, borderRadius: 5 }}>
              <Input type='number' placeholder='短信验证码' placeholderStyle='color:#878787' confirmType='search'
                     style={{ fontSize: '12px', width: '100%', height: 45, paddingLeft: '15px', paddingRight: '15px' }}
                // onConfirm={() => this.onSearch() }
                     maxlength={6}
                     value={this.state.code}
                     onInput={(e) => {
                       this.setState({code: e.target.value})
                     }}
              />

              <View style={{ display: 'flex', flexDirection: 'row', width: 120, justifyContent: 'center', alignItems: 'center' }}
                    onClick={() => {
                      this.sendSMS();
                    }}>
                <Text style={{ fontSize: 12, color: '#3ECCB1' }}>获取验证码</Text>
              </View>
            </View>
          </View>


          <Button
            style={{
              width: this.state.screenWidth - 40,
              backgroundColor: '#3ECCB1',
              color: '#FFF',
              fontSize: 14,
              marginTop: 30,
              padding: 5,
              fontWeight: 'bold'
            }}
            onClick={() => {
              this.onLogin();
            }}
          >登录</Button>





          {/* 意思协议 */}
          <AtFloatLayout
            isOpened={this.state.agreementModal}
            title={'服务协议和隐私政策'}
            onClose={() => {
              this.setState({agreementModal: false});
            }}>

            {/* 血栓全程管理 */}
            <View>
              一、总则
            </View>
            <View>
              1、血栓全程管理作为健康交流互通平台为您提供相关服务。为确保您能正常地使用血栓全程管理的服务，您应当阅读并遵守《血栓全程管理用户协议》（以下简称“本协议”）。请您务必审慎阅读、充分理解各条款内容，特别是免除或限制责任的相应条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。本协议中的网站指血栓全程管理(www.ifufan.com，以下简称“网站”)。本协议由网站的使用者（以下简称“您”）与网站共同签订。
            </View>

            <View>2、除非您已阅读并接受本协议所有条款，否则您无权使用血栓全程管理的服务（以下简称“本服务”）。您对本网站的登录、查看、发布信息等行为即视为您已阅读并同意本协议的约束，包括接受更新后的本协议条款。当您与本网站发生争议时，应以最新的服务协议为准。</View>
            <View>3、血栓全程管理为您提供全面的健康服务，为充分保护您对于血栓全程管理提供的各项服务的知情权，血栓全程管理就其提供的各项服务的相关性、有效性以及限制性提供以下注册条款。血栓全程管理在此特别提醒您，在您使用注册前已确实仔细阅读了本协议，如果您对本协议的任何条款或者将来随时可能修改、补充的条款有异议，您可选择不注册成为血栓全程管理的用户。</View>
            <View>4、您在进行注册程序过程中，根据声音、文字或图形提示可以选择表示“同意”的操作，当您点选“同意”按钮时即视为您已仔细阅读本协议，同意接受本协议项下的所有条款，包括接受血栓全程管理对本协议条款随时所做的任何修改，并愿意受其约束。之后方能按系统提示完成全部注册程序、问答程序、享受挂号服务及健康信息服务程序。</View>
            <View>5、您在血栓全程管理提问、搜索、提供健康信息、与其它用户交流及其他健康类服务，即代表您已经同意本协议。</View>
            <View>6、本协议的条款适用于血栓全程管理提供的各种服务，但当您使用血栓全程管理某一特定服务时，如该服务另有单独的服务条款、指引或规则，您应遵守本协议及血栓全程管理随时公布的与该服务相关的服务条款、指引或规则等。前述所有的指引和规则，均构成本协议的一部分。除非本协议另有其他明示规定，新推出的产品或服务、增加或强化目前本服务的任何新功能，均受到本协议之规范。</View>

            <View>二、服务简介</View>
            <View>1、血栓全程管理作为健康交流互通平台仅向经正规医疗机构的就诊过的人群提供相关服务。因此，您必须是经合法登记的人群。若不符合本项条件，请勿使用本服务，血栓全程管理可随时自行全权决定拒绝向任何人士提供本服务。本服务不会提供给被暂时或永久中止资格的本网站会员。</View>
            <View>2、血栓全程管理运营方运用自己的操作系统通过国际互联网为您提供血栓全程管理的网络服务，并承担本协议和其它服务协议中对您的责任和义务。为使用本服务，您必须能够自行通过有法律资格的第三方对您提供互联网接入服务，并自行承担以下内容：</View>
            <View>(1)自行配备上网所需的设备，包括个人电脑，调制解调器及其他必要的设备装置。</View>
            <View>(2)自行承担上网所需的相关必要费用，如：电话费用、网络费用等。</View>
            <View>(3)本协议中规定的您的其他责任和义务。</View>
            <View>3、您应保证：提供详尽、真实、准确和完整的个人资料。如果资料发生变动，您应及时更改。若您提供任何错误、不实、过时或不完整的资料，并为血栓全程管理所确知；或者血栓全程管理有合理理由怀疑前述资料为错误、不实、过时或不完整的资料，血栓全程管理有权暂停或终止您的帐号，并拒绝现在或将来使用本服务的全部或一部分。在此情况下，您可通过血栓全程管理的申诉途径与血栓全程管理取得联系并修正个人资料经血栓全程管理核实后恢复账号使用。</View>

            <View>三、服务暂停、变更与中止条款</View>
            <View>1、鉴于移动互联网服务的特殊性，血栓全程管理有权随时变更、中断或终止部分或全部的服务。如变更、中断或终止的服务属于免费服务，血栓全程管理无需通知您，也无需对任何您或任何第三方承担任何责任。</View>
            <View>2、您理解，血栓全程管理需要定期或不定期地对提供本服务的平台或相关的设备进行检修或者维护，如因此类情况而造成本服务在合理时间内的中断，血栓全程管理无需为此承担任何责任，但血栓全程管理应尽可能事先进行通告。</View>
            <View>3、如发生下列任何一种情形，血栓全程管理有权随时中断或终止向您提供本协议项下的服务而无需对您或任何第三方承担任何责任：</View>
            <View>(1) 您提供的个人资料不真实；</View>
            <View>(2) 您违反本协议中的规定；</View>
            <View>(3) 您违反血栓全程管理发布的政策；</View>
            <View>(4) 血栓全程管理认为其他不适宜的地方。</View>

            <View>四、您的帐号、密码和安全性</View>
            <View>1、您一旦注册成功，成为血栓全程管理的合法用户，将得到一个您的帐号和密码。您的帐号和密码由您负责保管。您都要对任何以您帐号进行的所有活动和事件负全责，且您有权随时根据指示更改您的密码。若发现任何非法使用您的帐号或存在安全漏洞的情况，请立即通知血栓全程管理。</View>
            <View>2、因黑客行为或您的保管疏忽等情况导致帐号、密码遭他人非法使用，血栓全程管理不承担责任。为向您提供本服务，您同意并授权血栓全程管理将您在注册、使用本服务过程中提供、形成的信息传递给为您提供您所要求的产品和服务、而必须和第三方分享您的个人信息，向您提供其他服务的第三方，或从提供其他服务的第三方获取您在注册、使用其他服务期间提供、形成的信息。血栓全程管理将根据法律法规的要求，履行其作为移动互联网信息服务提供者应当履行的义务。</View>

            <View>五、隐私保护</View>
            <View>1、保护您隐私是血栓全程管理的一项基本政策，血栓全程管理保证不对外公开或向第三方提供您的注册资料及您在使用本服务时存储在血栓全程管理的非公开内容，但下列情况除外：</View>
            <View>(1) 事先获得您的明确授权；</View>
            <View>(2) 根据有关的法律法规要求；</View>
            <View>(3) 按照相关政府主管部门的要求；</View>
            <View>(4) 为维护社会公众的利益；</View>
            <View>(5) 为维护血栓全程管理的合法权益。</View>
            <View>2、血栓全程管理可能会与第三方合作向您提供相关的网络服务，在此情况下，您同意并授权血栓全程管理将您的注册资料等提供给该第三方。</View>
            <View>3、在不透露单个您隐私资料的前提下，您同意血栓全程管理对整个您数据库进行分析并对您数据库进行商业上的利用，包括出售您数据库中的信息。</View>
            <View>4、对于您在享受服务过程中获得的第三方的信息或资料（包括但不限于用户信息、用户健康资料以及用于存储在血栓全程管理的仅向您公开的内容），您仅能用于解决该用户问题、在同户同意的特定事项中或用户的授权范围内使用。您不得用于其它用途、向其它第三方进行公开、透露或授权其它第三方进行使用。</View>

            <View>六、协议修改</View>
            <View>血栓全程管理有权在必要时修改本协议条款，协议条款一旦发生变动，届时将在您界面提示修改内容，该提示行为视为血栓全程管理已经通知您修改内容，如果您不同意所作的修改，可以主动取消获得的网络服务，进行注销。如果您继续享有血栓全程管理提供的服务，则被视为接受协议变动。当发生有关争议时，以最新的注册协议为准。</View>

            <View>七、特别授权</View>
            <View>您完全理解并不可撤销地授予血栓全程管理下列权利：</View>
            <View>1、一旦您向血栓全程管理作出任何形式的承诺，且相关机构已确认您违反了该承诺，则血栓全程管理有权立即按您的承诺或协议约定的方式对您的账户采取限制措施，包括中止或终止向您提供服务，并公示相关机构确认的您的违约情况。您了解并同意，血栓全程管理无须就相关违约事项与您核对事实，或另行征得您的同意，且血栓全程管理无须就此限制措施或公示行为向您或任何第三方承担任何的责任。</View>
            <View>2、一旦您违反本协议、或与血栓全程管理签订其他协议的约定，血栓全程管理有权以任何方式通知本服务或其他相关血栓全程管理，要求其对您的权益采取限制措施，包括但不限于要求中止、终止对您提供的部分或全部服务，且在其经营或实际控制的网站或APP公示您的违约情况。</View>
            <View>3、您授权血栓全程管理通过您注册、使用本服务过程中形成的信息通过短信、邮件、电话或其他形式向您传送血栓全程管理提供的服务。您同意接受血栓全程管理通过短信、邮件、电话或其他形式向您发送活动、服务或其他相关商业信息。如果您不需要血栓全程管理提供的部分或全部服务的活动、服务或其他相关商业信息的服务，在您向血栓全程管理客服提出申请后予以中止、终止对您提供的该部分或全部服务。</View>

            <View>八、血栓全程管理拒绝提供担保</View>
            <View>1、您对移动网络服务的使用承担风险，以及其因为使用移动网络服务而产生的一切后果。血栓全程管理对此不作任何类型的担保，不论是明确的或隐含的，但是不对商业性的隐含担保、特定目的和不违反规定的适当担保作限制。</View>
            <View>2、血栓全程管理不担保服务一定能完全满足您的要求，也不担保各项服务不会受网络、通信等原因而中断，对服务的及时性、安全性、错误程序的发生都不作担保。</View>
            <View>3、血栓全程管理因受合作医疗机构等资源限制，就您所提咨询等请求不担保服务一定能够成功。</View>
            <View>4、血栓全程管理对在血栓全程管理APP上得到的任何有关健康的咨询意见、康复情况的保证效果等，不作担保。</View>

            <View>九、对您信息的存储和限制</View>
            <View>1、血栓全程管理对您使用网络服务而受到的任何直接、间接、偶然、特殊及继起的损害（血栓全程管理违反法律、法规和本协议的条款除外）不负责任，这些损害可能来自：不正当使用网络服务，私自在网上进行交易，非法使用网络服务或您传送的信息有所变动。这些行为都有可能会导致血栓全程管理的形象受损，所以血栓全程管理事先提出这种损害的可能性。因发生如火灾、水灾、暴动、骚乱、战争、自然灾害等不可抗拒事故，血栓全程管理所不能控制的事件而影响血栓全程管理提供服务，血栓全程管理无须承担任何责任。</View>
            <View>2、血栓全程管理不对您所发布信息的删除或储存失败负责。血栓全程管理积极采用数据备份加密等措施保障您数据的安全，但不对由于因意外因素导致的数据损失和泄漏负责。血栓全程管理有权审查和监督您的行为是否符合本协议的要求，如果您违背了本协议的约定，则血栓全程管理有权中断您的服务。</View>

            <View>十、用户管理</View>
            <View>1、您在进行注册过程中，您的用户名注册与使用应符合网络道德，遵守中华人民共和国的相关法律法规。您的用户名和昵称中不能含有威胁、淫秽、谩骂、非法、侵害他人正当权益等有争议性的文字。您在血栓全程管理上的言论不得违法、不得违反公序良俗、不得使用攻击性语言恶意中伤他人，或作出虚假性陈述。您保证您在血栓全程管理上提供的信息的真实性、合法性和有效性。您单独承担在血栓全程管理上发布内容的一切相关责任。您使用或提供的服务应遵守所有适用于血栓全程管理的地方法律、国家法律和国际法律标准。</View>
            <View>2、您应遵守从中国境内向外传输技术性资料时必须符合中国有关法律法规。</View>
            <View>3、您使用本服务不作其他非法用途。</View>
            <View>4、您不得干扰或扰乱本服务。不得盗用他人帐号，并对由此行为造成的后果自负。</View>
            <View>5、您应遵守所有使用本服务的各项协议、规定、程序和惯例。您须承诺不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽等信息资料。另外，您也不能传输任何教唆他人构成犯罪行为的资料；不能传输助长国内不利条件和涉及国家安全的资料；不能传输任何不符合当地法规、国家法律和国际法律的资料。未经许可而非法进入其它电脑系统是禁止的。</View>
            <View>6、您不得发布任何不基于事实、虚构、夸大、引人误解的信息；不得发布涉及政治、性别、种族歧视或攻击他人的文字、图片、视频或语言等信息；不得发布介绍个人、科室等广告性质的内容；不得有其它涉及违反当地法规、国家法律和国际法律的行为。</View>
            <View>
              7、您发布的文章、视频、资讯不得侵犯任何第三方的合法知识产权。您在本网站上发布内容，包括文章、动态、评论、病例等形式时，默认您已知悉并同意血栓全程管理发布的有关信息发布协议。
            </View>
            <View>8、若您的行为不符合本协议的规定，血栓全程管理有权做出独立判断，并立即停止向该您帐号提供服务。您需对自己在网上的行为承担法律责任。您若在血栓全程管理上散布和传播反动、色情或其他违反国家法律的信息，血栓全程管理的系统记录有可能作为您违反法律的证据。</View>
            <View>9、您的授权行为：对血栓全程管理而言，您帐号和密码是唯一验证您真实性的依据，只要使用了正确的您帐号和密码无论是谁登录均视为已经得到注册您本人的授权。</View>

            <View>十一、保障</View>
            <View>您同意保障和维护血栓全程管理的利益，如果因为您违反有关法律、法规或本协议的任何规定而给血栓全程管理、用户或任何其他第三方造成任何损失，您统一承担由此产生的损害赔偿责任，其中包括血栓全程管理为此而支付的律师费用。</View>

            <View>十二、结束服务</View>
            <View>您或血栓全程管理可随时根据用户管理的规范（参见本协议的第十条）和实际情况中断一项或多项本服务，血栓全程管理无需对您或任何其他第三方负责。您对本协议的修改有异议，或对血栓全程管理的服务不满，可以行使如下权利。</View>
            <View>1、停止使用血栓全程管理提供的服务。</View>
            <View>2、通告血栓全程管理停止对该您帐号的服务。结束您的服务后，您使用本服务的权利马上终止，即刻，血栓全程管理不对您承担任何义务和责任。</View>

            <View>十三、通告</View>
            <View>1.本协议项下所有的通知均可通过重要页面公告、电子邮件或常规的信件传送等方式进行；该等通知于发送之日视为已送达。</View>
            <View>2.您对于血栓全程管理的通知应当通过血栓全程管理对外正式公布的通信地址、电子邮件地址等联系信息进行邮寄书面送达。</View>

            <View>十四、广告说明</View>
            <View>1、血栓全程管理上为您的便利而提供的外部链接，包括但不限于任何广告内容链接，以及该链接所指向网页之所有内容，均系该网页所属第三方血栓全程管理的所有者制作和提供（以下简称“第三方网页”）。第三方网页并非也不反映血栓全程管理之任何意见和主张，也不表示血栓全程管理同意或支持该第三方网页上的任何内容、主张或立场。血栓全程管理对第三方网页中内容之合法性、准确性、真实性、适用性、安全性和完整性等概不承担任何负责。任何单位或个人如需要第三方网页中内容（包括资讯、资料、消息、产品或服务介绍、报价等），并欲据此进行交易或其他行为前，应慎重辨别这些内容的合法性、准确性、真实性、适用性、完整性和安全性（包括下载第三方网页中内容是否会感染电脑病毒），并采取谨慎的预防措施。如您不确定这些内容是否合法、准确、真实、实用、完整和安全，建议您先咨询专业人士。</View>
            <View>2、任何单位或者个人因相信、使用第三方网页中信息、服务、产品等内容，或据此进行交易等行为，而引致的人身伤亡、财产毁损（包括因下载而感染电脑病毒）、名誉或商誉诽谤、版权或知识产权等权利的侵犯等事件，及因该等事件所造成的损害后果，血栓全程管理概不承担任何法律责任。无论何种原因，血栓全程管理不对任何非与血栓全程管理直接发生的交易和行为承担任何直接、间接、附带或衍生的损失和责任。</View>

            <View>十五、网络服务的内容所有权</View>
            <View>血栓全程管理提供网络服务的内容包括：文字、软件、声音、照片、视频、录像、图表；网页、广告中的全部内容；电子邮件中的全部内容；血栓全程管理为您提供的其他信息。所有这些信息均受版权、商标、标签和其他财产所有权法律的保护。未经相关权利人同意，上述资料均不得在任何媒体直接或间接发布、播放、出于播放或发布目的而改写或再发行，或者被用于其他任何商业目的。所有这些资料或资料的任何部分仅可作为私人和非商业用途而保存在某台计算机内。血栓全程管理的所有内容版权归原文作者和血栓全程管理共同所有，任何人需要转载血栓全程管理的内容，必须获得原文作者或血栓全程管理的明确授权。</View>

            <View>十六、法律</View>
            <View>1、本协议之效力、解释、执行和争议的解决均适用中华人民共和国之法律。如本协议之任何一部分与中华人民共和国法律相抵触，则该部分条款应按有关法律规定重新解释，部分条款之无效或重新解释不影响其它条款之法律效力。</View>
            <View>2、您和血栓全程管理运营方一致同意凡因本协议所产生的纠纷双方应协商解决，协商不成任何一方可提交血栓全程管理所有人所在地法院诉讼裁决。</View>

          </AtFloatLayout>

        </View>
      );
    }
    else
    {
      return(
        <View/>
      );
    }

  }
}
