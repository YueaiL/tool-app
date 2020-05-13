<template>
  <el-container>
    <el-main>
      <el-row>
        <div>
          <el-row>
            <el-col :span="2">
              <el-tag>{{sourceData}}</el-tag>
            </el-col>
            <el-col>
              <el-input type="textarea" rows="6" v-model="originalData"></el-input>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-input v-model="nb.imei" :size="inputMini">
            <template slot="prepend">{{spans.imeiSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="nb.iaddr" :size="inputMini">
            <template slot="prepend">{{spans.iaddrSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="nb.imsi" :size="inputMini">
            <template slot="prepend">{{spans.imsiSpan}}</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-input v-model="nb.controlType" :size="inputMini">
            <template slot="prepend">
              <el-tooltip class="item" effect="dark" :content="apnInstructions" placement="top-start">
                <span>{{spans.controlTypeSpan}}</span>
              </el-tooltip>
            </template>
          </el-input>
        </el-col>
        <el-col :span="9">
          <el-input v-model="nb.iccId" :size="inputMini">
            <template slot="prepend">{{spans.iccIdSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="9">
          <el-input v-model="nb.upTime" :size="inputMini">
            <template slot="prepend">{{spans.upTimeSpan}}</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-input v-model="nb.showValue" :size="inputMini">
            <template slot="prepend">{{spans.showValueSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.sendingInterval" :size="inputMini">
            <template slot="prepend">{{spans.sendingIntervalSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.valve" :size="inputMini">
            <template slot="prepend">{{spans.valveSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.battery" :size="inputMini">
            <template slot="prepend">{{spans.batterySpan}}</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-input v-model="nb.version" :size="inputMini">
            <template slot="prepend">{{spans.versionSpan}}</template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.snr" :size="inputMini">
            <template slot="prepend">
              <el-tooltip class="item" effect="dark" content="信噪比" placement="top-start">
                <span>{{spans.snrSpan}}</span>
              </el-tooltip>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.rssi" :size="inputMini">
            <template slot="prepend">
              <el-tooltip class="item" effect="dark" content="信号强度" placement="top-start">
                <span>{{spans.rssiSpan}}</span>
              </el-tooltip>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.valvePlay" :size="inputMini">
            <template slot="prepend">
              <span>{{spans.valvePlaySpan}}</span>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-aside>
      <el-row>
        <el-col>
          <div style="height: 30px"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-button @click="pars">解析</el-button>
        </el-col>
      </el-row>

    </el-aside>
  </el-container>
</template>

<script>
  import Nbiot from "../pojo/Nbiot";

  let _ = require('lodash');
  import '@/pojo/Nbiot.js';

  export default {
    name: "dataPars",
    data() {
      return {
        sourceData: '源数据',
        originalData: '{"flagStart":104,"meterType":1,"meterAddr":"hncmA2UZRHA=","command":129,"dataAreaLen":156,"dataArea":"AAAAAAEAAAAAAAAYiYYRGCgwCVAZggAPQdwgBRMRMwAABTgAAAAAolL3dgfmRRLdAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAPQdwAD0HcAA9B3AAPQdwAD0Hc","crc":188,"flagEnd":22}',
        copyTrueData: '请复制正确的数据',
        types: {
          'telecom': ['flagStart', 'meterType','flagEnd'/* 'meterAddr', 'command', 'dataAreaLen', 'dataArea', 'crc'*/]
        },
        deviceTypes: {
          6: 'Basic188'
        },
        padStartStr: '0',
        inputMini: 'mini',
        imeispan: 'imei',
        nb: {
          imei: '',
          iaddr: '',
          controlType: '',
          iccId: '',
          showValue: '',
          upTime: '',
          sendingInterval: '',
          valve: '',
          battery: '',
          valvePlay: '',
          imsi: '',
          version: '',
          snr: '',
          rssi: '',
        },
        apnInstructions: 'APN:控制类型\n81:上报数据',
        controls: {
          up: '81'
        },
        spans: {
          imeiSpan: 'IMEI',
          iaddrSpan: '表地址',
          controlTypeSpan: 'APN',
          iccIdSpan: 'ICCID',
          showValueSpan: '流量',
          upTimeSpan: '时间',
          sendingIntervalSpan: '上报周期',
          valveSpan: '阀门',
          batterySpan: '电池',
          valvePlaySpan: '阀门摆动',
          imsiSpan: 'IMSI',
          versionSpan: '版本',
          snrSpan: '信噪比',
          rssiSpan: '信号强度',
        }


      }
    },
    methods: {
      pars: function () {
        let data = this.originalData.trim();
        //数据类型 电信 移动 原本数据  base64数据 数据域数据
        if (data.length == 0) {
          this.$message.error('请输入');
        }
        let n = new Nbiot(data,this.nb);
        this.nb = n.typeJudgment();
        // this.typeJudgment(data);
      },
      typeJudgment: function (data) {
        let result = '';
        //判断是否是电信
        if (this.indexOfAll(data, this.types['telecom'])) {
          let json = JSON.parse(data);
          let t = json['meterType'];
          if(t == '1'){
            //普通NB表
            /*	{"flagStart":104,"meterType":1,"meterAddr":"hkFiBFcXU4A=","command":129,"dataAreaLen":156,"dataArea":"AAAAAAEAADIAMDYZiYYRGSZwATZzhAAAAB4gBRIYMgEFoAgAAAAAo1W5/wi68RndAAAAAAAAAAAAAAAAAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAe","crc":25,"flagEnd":22}*/
            result += json['flagStart'].toString('16');
            result += _.padStart(json['meterType'], 2, this.padStartStr);
            result += this.common.base64toHEX(json['meterAddr']);
            result += _.padStart(json['command'].toString('16'), '2', this.padStartStr);
            result += _.padStart(json['dataAreaLen'].toString('16'), 4, this.padStartStr);
            result += this.common.base64toHEX(json['dataArea']);
            result += _.padStart(json['crc'].toString('16'), 2, this.padStartStr);
            result += _.padStart(json['flagEnd'].toString('16'), 2, this.padStartStr);
            console.log(result);
            // let n = new Nbiot(data,6,v);
          }

          this.parsNbiotDevice(result);

        }
      },
      indexOfAll: function (data, arr) {
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          console.log(arr[i], data.indexOf(arr[i]), data.indexOf(arr[i].toString()))
          if (data.indexOf(arr[i].toString()) < 0) {
            return false;
          }
        }
        return true;
      },
      parsNbiotDevice: function (data) {
        //解析普通NB表
        let da = data.substring(0, data.length - 4);
        let crc = this.common.checkSum(da);
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

      },

      telecomPars: function (data) {

      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .el-row :last-child {
    margin-bottom: 0px;
  }
</style>
