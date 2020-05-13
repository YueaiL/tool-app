import common from '../common/common'
let _ = require('lodash');
export default class Nbiot {

  constructor(data,nb) {
    this.data = data;
    this.nb = nb;
    this.types = {
      'telecom': ['flagStart', 'meterType', 'flagEnd'/* 'meterAddr', 'command', 'dataAreaLen', 'dataArea', 'crc'*/]
    };
    this.padStartStr = '0';
    this.controls= {
      up: '81'
    }
  }

  vaildSum() {
    let data = this.data;
    let da = data.substring(0, data.length - 4);
    let crc = this.common.checkSum(da);
    if (crc == data.substring(data.length - 4, data.length - 2)) {
      return true;
    }
    return false;
  }

  typeJudgment() {
    let result = '';
    //判断是否是电信
    if (this.indexOfAll(this.data, this.types['telecom'])) {
      let json = JSON.parse(this.data);
      let t = json['meterType'];
      if (t == '1') {
        //普通NB表
        /*	{"flagStart":104,"meterType":1,"meterAddr":"hkFiBFcXU4A=","command":129,"dataAreaLen":156,"dataArea":"AAAAAAEAADIAMDYZiYYRGSZwATZzhAAAAB4gBRIYMgEFoAgAAAAAo1W5/wi68RndAAAAAAAAAAAAAAAAAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAe","crc":25,"flagEnd":22}*/
        result += json['flagStart'].toString('16');
        result += _.padStart(json['meterType'], 2, this.padStartStr);
        result += common.base64toHEX(json['meterAddr']);
        result += _.padStart(json['command'].toString('16'), '2', this.padStartStr);
        result += _.padStart(json['dataAreaLen'].toString('16'), 4, this.padStartStr);
        result += common.base64toHEX(json['dataArea']);
        result += _.padStart(json['crc'].toString('16'), 2, this.padStartStr);
        result += _.padStart(json['flagEnd'].toString('16'), 2, this.padStartStr);
        console.log(result);
        // let n = new Nbiot(data,6,v);
      }

      this.parsNbiotDevice(result);
    }
    console.log(this.nb)
    return this.nb;
  }


  indexOfAll(data, arr) {
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i], data.indexOf(arr[i]), data.indexOf(arr[i].toString()))
      if (data.indexOf(arr[i].toString()) < 0) {
        return false;
      }
    }
    return true;
  }

  parsNbiotDevice(data) {
    //解析普通NB表
    let da = data.substring(0, data.length - 4);
    let crc = common.checkSum(da);
    if (crc == data.substring(data.length - 4, data.length - 2)) {
      this.nb.imei = data.substring(4, 20);
      //控制类型
      this.nb.controlType = data.substring(20, 22);
      //数据长度
      let len = data.substring(22, 26);
      this.imeispan = '表版本'
      //命令类型
      if (this.nb.controlType == this.controls.up) {
        this.nb.iaddr = data.substring(36, 50);
        this.nb.iccId = data.substring(50, 70);
        this.nb.showValue = parseInt(data.substring(70, 78), 16) * 0.01;
        let d = data.substring(78, 90);
        this.nb.upTime = new Date().getFullYear().toString().substring(0, 2) + d.substring(0, 2) + '-' + d.substring(2, 4) + '-' + d.substring(4, 6) + ' ' + d.substring(6, 8) + ':' + d.substring(8, 10) + ':' + d.substring(10, 12);
        this.nb.sendingInterval = parseInt(data.substring(90, 94), 16);
        let state = _.padStart(parseInt(data.substring(94, 96), 16).toString('2'), 8, '0');
        this.nb.valvePlay = state.substring(1, 2) == '1' ? '摆动' : '无';
        let valve = parseInt(state.substring(2, 4), 2);
        if (valve == 0) {
          this.nb.valve = '无阀';
        } else if (valve == 1) {
          this.nb.valve = '关阀';
        } else if (valve == 2) {
          this.nb.valve = '关阀';
        } else if (valve == 3) {
          this.nb.valve = '不到位';
        } else {
          this.nb.valve = valve;
        }
        this.nb.battery = state.substring(4, 5) == '0' ? '欠压' : '正常';
        this.nb.version = parseInt(data.substring(106, 108), 16);
        this.nb.snr = parseInt(data.substring(116, 118), 16);
        this.nb.rssi = parseInt(data.substring(118, 120), 16);
      } else {

      }
    }

  }
}
