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
      <el-row>
        <el-col :span="6">
          <el-input v-model="nb.upTypeInput" :size="inputMini">
            <template slot="prepend">
                <span>{{spans.upType}}</span>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.commandTypeInput" :size="inputMini">
            <template slot="prepend">
                <span>{{spans.commandType}}</span>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="nb.dataLenInput" :size="inputMini">
            <template slot="prepend">
                <span>{{spans.dataLenSapn}}</span>
            </template>
          </el-input>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>{{spans.frozenData}}</el-tag>
          <el-input type="textarea" :rows="6" v-model="nb.frozenDataInput" :size="inputMini">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tag>{{spans.changeData}}</el-tag>
          <el-input type="textarea" :rows="3" v-model="nb.changeDataInput" :size="inputMini">
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
        <el-col :span="12">
          <el-button @click="pars">解析数据</el-button>
        </el-col>
        <!--<el-col :span="12">
          <el-button @click="parsCommand">解析命令</el-button>
        </el-col>-->
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
        // originalData: '{"flagStart":104,"meterType":1,"meterAddr":"hncmA2UZRHA=","command":129,"dataAreaLen":156,"dataArea":"AAAAAAEAAAAAAAAYiYYRGCgwCVAZggAPQdwgBRMRMwAABTgAAAAAolL3dgfmRRLdAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAPQdwAD0HcAA9B3AAPQdwAD0Hc","crc":188,"flagEnd":22}',
        originalData: '',
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
          upTypeInput: '',
          frozenDataInput: '',
          changeDataInput: '',
          commandTypeInput: '',
          dataLenInput: '',
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
          upType: '类型',
          frozenData: '冻结数据',
          changeData: '报文',
          commandType: '命令状态',
          dataLenSapn: '数据长度',
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

        Object.keys(this.nb).forEach(key => (this.nb[key] = ''));
        let n = new Nbiot(data,this.nb,this);
        try {
          this.nb = n.typeJudgment();
        }catch (e) {
          this.$message.error("解析失败,请确定数据格式正确!");
          console.log('解析异常:{}',e);
        }
        // this.typeJudgment(data);
      },
      parsCommand:function(){
        //解析命令
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
