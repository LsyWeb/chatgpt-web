<script setup lang="ts">
import Home from './pages/Home/index.vue';
</script>

<template>
  <header>
    <h1>chatgpt</h1>
    <a href="https://github.com/LsyWeb/chatgpt-web" target="_blank"
      ><i class="iconfont icon-github"></i
    ></a>
  </header>
  <Home />
</template>

<style lang="less" scoped>
header {
  height: 48px;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  a {
    font-size: 24px;
    i {
      font-size: 24px;
    }
    &:hover {
      text-decoration: underline;
      color: #609966;
      cursor: pointer;
    }
  }
  h1 {
    font-size: 24px;
  }
}
</style>
