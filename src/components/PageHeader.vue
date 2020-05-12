<template>
  <div>

    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
      <el-menu-item index="1" route="/">首页<!--<router-link to="/" ></router-link>--></el-menu-item>
      <el-menu-item index="2" route="/scon" >串口控制</el-menu-item>
      <el-submenu index="3">
        <template slot="title">NB-IOT</template>
        <el-menu-item index="2-1" route="/nbiot">数据解析</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
      <router-link to="/nbiot" tag="el-menu-item" index="4">数据解析</router-link>

      <!--<el-submenu index="12">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1"><router-link to="/hello" >HELLO</router-link></el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
  export default {
    name: 'PageHeader.vue',
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>
  .delAlink{
    color: #303133;
    text-decoration: none;
  }
</style>
