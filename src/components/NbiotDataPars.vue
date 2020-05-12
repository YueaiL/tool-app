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
    </el-main>
    <el-aside >
      <el-row>
        <el-col :span="6">
          <el-button @click="pars">解析</el-button>
        </el-col>
      </el-row>
    </el-aside>
  </el-container>
</template>

<script>
  let _ = require('lodash')
  export default {
    name: "dataPars",
    data() {
      return {
        sourceData: '源数据',
        originalData: '',
        copyTrueData: '请复制正确的数据',
        types:{
          'telecom':['notifyType','deviceId','service','serviceId','data']
        },
        deviceTypes:{
          6:'Basic188'
        },
        padStartStr:'0'

      }
    },
    methods: {
        pars: function () {
          let data = this.originalData;
          //数据类型 电信 移动 原本数据  base64数据 数据域数据
          if (data.length == 0) {
            this.$message.error('请输入');
          }
          this.typeJudgment(data);
        },
        typeJudgment: function (data) {
          debugger
          let result = '';
          //判断是否是电信
          if (this.indexOfAll(data, this.types['telecom'])) {
            let json = JSON.parse(data);
            let dataJson = json['service']['data'];
            //普通NB表
            if (data.indexOf(this.deviceTypes[6]) != -1) {
              /*	{"flagStart":104,"meterType":1,"meterAddr":"hkFiBFcXU4A=","command":129,"dataAreaLen":156,"dataArea":"AAAAAAEAADIAMDYZiYYRGSZwATZzhAAAAB4gBRIYMgEFoAgAAAAAo1W5/wi68RndAAAAAAAAAAAAAAAAAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAHgAAAB4AAAAe","crc":25,"flagEnd":22}*/
              result += dataJson['flagStart'].toString('16');
              result += _.padStart(dataJson['meterType'],2,this.padStartStr);
              result += this.common.base64toHEX(dataJson['meterAddr']);
              result += _.padStart(dataJson['command'].toString('16'),'2',this.padStartStr);
              result += _.padStart(dataJson['dataAreaLen'].toString('16'),4,this.padStartStr);
              console.log(result)
            }
          }
        },
        indexOfAll: function (data, arr) {
          console.log(arr)
          for (let i = 0; i < arr.length; i++) {
            console.log(arr[i],data.indexOf(arr[i]),data.indexOf(arr[i].toString()))
            if (data.indexOf(arr[i].toString()) < 0) {
              return false;
            }
          }
          return true;
        },


        telecomPars: function (data) {

        }
    }
  }
</script>

<style scoped>

</style>
