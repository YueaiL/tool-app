<template>
  <div>
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
          <div>
            <el-row>
              <el-col :span="2">
                <el-tag>{{analyData}}</el-tag>
              </el-col>
              <el-col>
                <el-input type="textarea" rows="6" :readonly="true" v-model="analyOverData"></el-input>
              </el-col>
            </el-row>
          </div>

        </el-row>
      </el-main>
      <el-aside>
        <el-row>
          <div style="height: 30px;"></div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class=""></div>
            <el-button @click="base64ToHex">base64转16进制</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="hexToBase64">16进制转base64</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button @click="strHexToTen">16进制转10进制</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="strTenToHex">10进制转16进制</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button @click="strSum">字数统计</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="splitOrJoin">切割或拼接</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button @click="checksum">校验和</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="crcVaild">CRC校验</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button @click="copyData('origin')">复制源数据</el-button>
          </el-col>
          <el-col :span="12">
            <el-button @click="copyData('analy')">复制解析数据</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button @click="analyOverData = (originalData = '')">清空</el-button>
          </el-col>
          <!--<el-col :span="12">
            <el-button @click="copyData('analy')">复制解析数据</el-button>
          </el-col>-->
        </el-row>
      </el-aside>
    </el-container>

  </div>
</template>

<script>
  export default {
    name: "IndexPage",
    data() {
      return {
        sourceData: '源数据',
        analyData: '解析数据',
        labelPosition: 'right',
        disabledChoose: true,
        analyOverData: '',
        originalData: ''
      }
    },
    methods: {
      base64ToHex: function () {
        let data = this.originalData;
        if (data.length == 0) {
          this.$message.error('请输入');
        }
        try {
          this.analyOverData = this.common.base64toHEX(data);
        } catch (e) {
          console.log(e)
          this.$message.error('请输入正确的base64数据');
          // this.analyOverData = '';
        }
      },
      hexToBase64: function () {
        let data = this.originalData;
        if (data.length == 0) {
          this.$message.error('请输入');
        }
        try {
          this.analyOverData = this.common.hexToBase64(data);
        } catch (e) {
          console.log(e)
          this.$message.error('请输入正确的base64数据');
          // this.analyOverData = '';
        }
      },
      strTenToHex: function () {
        try {
          this.analyOverData = parseInt(this.originalData).toString(16);
        } catch (e) {
          console.log(e)
          this.$message.error('请输入正确十进制整数')
        }
      },
      strHexToTen: function () {
        try {
          this.analyOverData = parseInt(this.originalData, 16);
        } catch (e) {
          console.log(e)
          this.$message.error('请输入正确十六进制整数');
        }
      },
      strSum: function () {
        this.$message.success(this.originalData.length.toString());
      },
      splitOrJoin: function () {
        let data = this.originalData;
        if (data.length == 0) {
          this.$message.error('请输入');
        }
        //存在空格则凭借  不存在则切割
        if (data.indexOf(' ') > 0) {
          let arr = data.split(' ');
          this.analyOverData = arr.join('');
        } else if (data.length % 2 == 0) {
          let result = '';
          for (let i = 0; i < data.length / 2; i++) {
            result += data.substring(i * 2, (i + 1) * 2) + ' ';
          }
          this.analyOverData = result.endsWith(' ') ? result.substring(0, result.length - 1) : result;
        } else {
          this.$message.error('请输入正确的数据');
        }
      },
      checksum: function () {
        let data = this.originalData;
        if(data.length % 2 != 0){
          this.$message.error("请输入正确的数据");
        }
        let sumStr = '';
        try {
          this.analyOverData = this.common.checkSum(data);
        }catch (e) {
          console.log(e)
          this.$message.error('请输入正确的数据')
        }
      },
      crcVaild: function () {
        try {
          this.analyOverData = this.CRC.ToModbusCRC16(this.originalData,true);
        }catch (e) {
          console.log(e)
          this.$message.error('请输入正确的数据')
        }
      },
      copyData:function (type) {
        if(type == 'origin'){
          this.$copyText(this.originalData).then(function (e) {
            console.log(e)
          },function (e) {
            console.log(e)
            this.$message.error('复制失败');
          })
        }else {
          this.$copyText(this.analyOverData).then(function (e) {
            console.log(e)
          },function (e) {
            console.log(e)
            this.$message.error('复制失败');
          })
        }
      }

    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  }

  .el-row :last-child {
    margin-bottom: 0px;
  }

  .el-button {
    width: 143px;
  }
</style>
