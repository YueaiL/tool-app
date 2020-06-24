import common from '../common/common'
let _ = require('lodash');
export default class Nbiot {

  constructor(data,nb,vue) {
    this.data = data.trim();
    this.nb = nb;
    this.types = {
      'telecom': ['flagStart', 'meterType', 'flagEnd'/* 'meterAddr', 'command', 'dataAreaLen', 'dataArea', 'crc'*/],
      'mobile':['msg','at','imei','type','ds_id','value','dev_id'],
      'base64':['+','/']

    };
    this.padStartStr = '0';
    this.controls= {
      up: 0x81,
      sendTime: 0x40,
      sendDateTime: 0x41,
      updateValue: 0x02,
      valveControl: 0x8,
      updateAddr: 0x15,
      updateIpAddr: 0x2A,
    };
    this.controlsLen = {
      dataUp: 0x9c,
      dataDown: 0xB,
      updateTimeDown: 0x7,
      updateDateTimeDown: 0xB,
      updateIpAddrLen: 0xb,
      updateValueLen: 0x9,
      updateAddrLen: 0xC,
      valveControlLen: 0x6,
      updateTimeUp: 0x8,
    };
    this.vue = vue;
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
    //判断是否是电信 电信 移动 原本数据  base64数据 数据域数据
    if(this.data.startsWith('{')){
      let json = JSON.parse(this.data);
      if (this.indexOfAll(this.types['telecom'])) {
        if(this.data.indexOf('notifyType') != -1){
          json = json['service']['data'];
        }else if(this.data.indexOf('serviceType') != -1){
          json = json['data'];
        }
        let t = parseInt(json['meterType'],16);
        if (t == '1') {
          //普通NB表
          /*	{"flagStart":104,"meterType":1,"meterAddr":"hkFiBFcXU4A=","command":129,"dataAreaLen":156,"dataArea":"AAAAAAEAADIAMDYZiYYRGSZwATZzhAAAAB4gBRIYMgEFoAgAAAAAo1W5/wi68RndAAAAAAAAAAAAAAAAAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAe","crc":25,"flagEnd":22}*/
          result = this.telecomBasci188(json);
        }else {
          this.vue.$message.error('数据异常,解析失败!');
          return ;
        }
      }
    } else if(this.data.startsWith('68') > -1) {
      //原生数据
      result = this.data;
    }else {
      //base64数据
      result = common.base64toHEX(this.data)
    }
    this.chooseType(result);
    this.nb.changeDataInput = result;
    console.log(this.nb)
    this.vue.$message.success('解析成功')
    return this.nb;
  }


  indexOfAll(arr) {
    let data = this.data;
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i], data.indexOf(arr[i]), data.indexOf(arr[i].toString()))
      if (data.indexOf(arr[i].toString()) < 0) {
        return false;
      }
    }
    return true;
  }

  chooseType(data){
    let type = data.substring(2,4);
    //NBiot表
    if(type == '01'){
      this.parsNbiotDevice(data);
    }
  }

  parsNbiotDevice(data) {
    //解析普通NB表
    let da = data.substring(0, data.length - 4);
    let crc = common.checkSum(da);
    //校验和
    if (crc.toUpperCase() == data.substring(data.length - 4, data.length - 2).toUpperCase()) {
      this.nb.imei = data.substring(4, 20);
      //控制类型
      this.nb.controlType = data.substring(20, 22);
      //数据长度
      this.nb.dataLenInput = data.substring(22, 26);
      let len = parseInt(this.nb.dataLenInput,16);
      this.imeispan = '表版本'
      //命令类型
      let i = parseInt(this.nb.controlType,16);
      if (i == this.controls.up) {
        this.nb.controlType += '/上报数据或者休眠';
        //上报数据
        if(len == this.controlsLen.dataUp){
          this.nb.iaddr = data.substring(36, 50);
          this.nb.iccId = data.substring(50, 70);
          this.nb.showValue = parseInt(data.substring(70, 78), 16) * 0.01;
          let d = data.substring(78, 90);
          this.nb.upTime = new Date().getFullYear().toString().substring(0, 2) + d.substring(0, 2) + '-' + d.substring(2, 4) + '-' + d.substring(4, 6) + ' ' + d.substring(6, 8) + ':' + d.substring(8, 10) + ':' + d.substring(10, 12);
          this.nb.sendingInterval = parseInt(data.substring(90, 94), 16);
          debugger
          let state = _.padStart(parseInt(data.substring(94, 96), 16).toString('2'), 8, '0');
          // this.nb.valvePlay = state.substring(1, 2) == '1' ? '摆动' : '无';
          let valve = parseInt(state.substring(2, 4), 2);
          if (valve == 0) {
            this.nb.valve = '无阀';
          } else if (valve == 1) {
            this.nb.valve = '关阀';
          } else if (valve == 2) {
            this.nb.valve = '开阀';
          } else if (valve == 3) {
            this.nb.valve = '阀门不到位';
          } else {
            this.nb.valve = valve;
          }
          this.nb.battery = state.substring(4, 5) == '0' ? '欠压' : '正常';
          this.nb.version = parseInt(data.substring(104, 106), 16);
          this.nb.snr = parseInt(data.substring(116, 118), 16);
          this.nb.rssi = parseInt(data.substring(118, 120), 16);
          let frozenDataInput = '冻结日期：'+data.substring(140,146)+'\n';
          let sourceRawData = '{';
          let hourDatas = data.substring(146,data.length-4);
          for (let j = 0; j < hourDatas.length/8; j++) {
            let h = hourDatas.substring(j*8,(j+1)*8);
            sourceRawData += j+'点：'+ h;
            frozenDataInput += j+'点：'+(parseInt(h,'16')*0.01).toFixed(2);
            frozenDataInput+='\t';
            sourceRawData+='\t';
          }
          this.nb.frozenDataInput = frozenDataInput+'\n原数据：'+sourceRawData+'}';

          this.nb.upTypeInput = '上行';
        }else {
          this.nb.upTypeInput = '下行';
          let d = data.substring(26, 40);
          this.nb.upTime = new Date().getFullYear().toString().substring(0, 2) + d.substring(0, 2) + '-' + d.substring(2, 4) + '-' + d.substring(4, 6) + ' ' + d.substring(6, 8) + ':' + d.substring(8, 10) + ':' + d.substring(10, 12);
        }
      } else if(i == this.controls.sendTime) {
        this.nb.controlType += '/修改上报周期';
        //发送周期
        //下发命令
        if(len == this.controlsLen.updateTimeDown){
          this.nb.sendingInterval = parseInt(data.substring(36,40),16);
          this.nb.upTypeInput = '下行';
        }else {
          this.nb.upTypeInput = '上行';
          this.nb.commandTypeInput = this.commandTypeIs(data.substring(36,38))
          this.nb.sendingInterval = parseInt(data.substring(38,42),16);
        }
      }else if(i == this.controls.sendDateTime){
        //修改上报时间
        this.nb.controlType += '/修改上报时间';
        if(len == this.controlsLen.updateDateTimeDown){
          this.nb.upTime = data.substring(36,48);
          this.nb.sendingInterval = 1440;
          this.nb.upTypeInput = '下行';
        }else {
          this.nb.upTypeInput = '上行';
          this.nb.commandTypeInput = this.commandTypeIs(data.substring(36,38))
          this.nb.sendingInterval = 1440;
        }
      }else if(i == this.controls.updateValue){
        //修改水表底数
        this.nb.controlType += '/设置底数';
        if(len == this.controlsLen.updateValueLen){
          this.nb.showValue = (parseInt(data.substring(36,44),'16')*0.01).toFixed(2);
          this.nb.upTypeInput = '下行';
        }else {
          this.nb.upTypeInput = '上行';
          this.nb.commandTypeInput = this.commandTypeIs(data.substring(36,38))
          this.nb.showValue = (parseInt(data.substring(38,46),'16')*0.01).toFixed(2);
        }
      }else if(i == this.controls.valveControl){
        //阀门控制
        this.nb.controlType += '/阀门控制';
        let t = '';
        if(len == this.controlsLen.valveControlLen){
           t = parseInt(data.substring(36,38));
          if(t == 0){
            this.nb.valve = '关阀';
          }else if(t == 2){
            this.nb.valve = '开阀';
          }else if(t == 1){
            this.nb.valve = '阀门摆动';
          }
          this.nb.upTypeInput = '下行';
        }else {
          this.nb.upTypeInput = '上行';
          this.nb.commandTypeInput = this.commandTypeIs(data.substring(36,38))
          t = parseInt(data.substring(38,40));
          /*if(t == 0){
            this.nb.valve = '无阀';
          }else if(t == 2){
            this.nb.valve = '开阀';
          }else if(t == 1){
            this.nb.valve = '关阀';
          }else if(t == 3){
            this.nb.valve = '阀门摆动';
          }*/
        }
      }else if(i == this.controls.updateAddr){
        //修改设备地址
        this.nb.controlType += '/修改设备地址';
        if(len == this.controlsLen.updateAddrLen){
          this.nb.iaddr = data.substring(36,50);
          this.nb.upTypeInput = '下行';
        }else {
          this.nb.upTypeInput = '上行';
          this.nb.commandTypeInput = this.commandTypeIs(data.substring(36,38))
          this.nb.iaddr = data.substring(38,52);
        }
      }else if(i == this.controls.updateIpAddr){
        //修改ip地址
        this.nb.controlType += '/修改ip地址';
        if(len == this.controlsLen.updateIpAddrLen){
          // this.nb.iaddr = data.substring(36,50);
          this.nb.upTypeInput = '下行';
        }else {
          this.nb.upTypeInput = '上行';
          this.nb.commandTypeInput = this.commandTypeIs(data.substring(36,38))
          // this.nb.iaddr = data.substring(38,52);
        }
      }
    }else {
      this.vue.$message.error('校验和异常!');
      return;
    }

  }

  telecomBasci188(json){
    let result = '';
    result += json['flagStart'].toString('16');
    result += _.padStart(json['meterType'], 2, this.padStartStr);
    result += common.base64toHEX(json['meterAddr']);
    result += _.padStart(json['command'].toString('16'), '2', this.padStartStr);
    result += _.padStart(json['dataAreaLen'].toString('16'), 4, this.padStartStr);
    result += common.base64toHEX(json['dataArea']);
    result += _.padStart(json['crc'].toString('16'), 2, this.padStartStr);
    result += _.padStart(json['flagEnd'].toString('16'), 2, this.padStartStr);
    return result;
  }

  commandTypeIs(type){
    let t = parseInt(type,16);
    if(t == 0){
      return '执行成功';
    }else {
      return "执行失败";
    }
  }
}
