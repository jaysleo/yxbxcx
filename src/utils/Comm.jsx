export default class {

  static userData = null;
  static currentDisease = null;
  static currentPatiant = null;
  // 传递的表单json数据
  static jsonStr = '';

  // 轮询延迟
  static polldelayValue = null;
  // 聊天信息
  static msgData = [];
  // 所有聊天数据的id
  static msgIDs = [];

  // 获取随机数
  static randRange = (min, max) =>
  {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
  };

}
