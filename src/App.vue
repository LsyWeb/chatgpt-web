<script setup lang="ts">
import Home from './pages/Home/index.vue';
</script>

<template>
  <header>
    <h1>chatgpt</h1>
    <a href="https://github.com/LsyWeb/chatgpt-web" target="_blank">github链接</a>
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
  a {
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
