<template>
  <div class="home-container">
    <div v-if="isChat" class="content" ref="scrollRef" @scroll="onScroll">
      <template v-for="item in state.messageList" :key="item.id">
        <MessageItem :message="item" />
      </template>
    </div>
    <div v-else class="empty">
      <h1>开始聊天</h1>
      <div class="typed">
        <div id="hello-chatgpt"></div>
      </div>
    </div>
    <Search :loading="state.loading" @send-message="sendMessage" />
    <BackTop v-if="state.isShowBackTop" @on-back-top="onBackTop" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { Cloud } from 'laf-client-sdk';
import { marked } from 'marked';
import 'highlight.js/styles/atom-one-dark.css';
import highjs from 'highlight.js';
import Typed from 'typed.js';
import { v4 } from 'uuid';
import { MessageType, type Message } from '@/types';
import MessageItem from '@/components/Message/index.vue';
import Search from '@/components/Search/index.vue';
import BackTop from '@/components/BackTop/index.vue';
highjs.highlightAll();
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && highjs.getLanguage(lang)) {
      return highjs.highlight(code, { language: lang }).value;
    }
    return highjs.highlightAuto(code).value;
  },
});

const APP_ID = import.meta.env.VITE_LAF_APP_ID;

const state = reactive({
  loading: false,
  messageList: [] as Message[],
  isShowBackTop: false,
});
const isChat = computed(() => state.messageList.length > 0); // 是否开始聊天

const parentMessageId = ref(); // 上下文消息id

const scrollRef = ref<HTMLElement | null>(null); // 滚动容器
const observer = ref<MutationObserver | null>(null); // 监听滚动容器的clientHeight变化

// 监听滚动，在chatgpt输出文字的时候，自动滚动到底部
watch([isChat, scrollRef], () => {
  let falg = false;
  if (isChat.value && scrollRef.value!) {
    // 这里使用 MutationObserver 来监听元素属性的变化，
    // MutationObserver Api参考: https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
    observer.value = new MutationObserver((entries) => {
      if (!falg) {
        requestAnimationFrame(() => {
          console.log('entries', entries);
          onScrollEnd();
          falg = false;
        });
        falg = true;
      }
    });
    observer.value.observe(scrollRef.value!, {
      childList: true,
      subtree: true,
      attributeFilter: ['clientHeight'],
    });
  }
});

let flag = false;
// 滚动事件
const onScroll = (e: any) => {
  if (!flag) {
    requestAnimationFrame(() => {
      // 控制回到顶部按钮的显示/隐藏
      if (e?.target?.scrollTop > 100) {
        state.isShowBackTop = true;
      } else {
        state.isShowBackTop = false;
      }
      flag = false;
    });
    flag = true;
  }
};
// 回到顶部
const onBackTop = () => {
  scrollRef.value!.scrollTop = 0;
};
// 发送消息
const sendMessage = async (searchValue: string) => {
  if (state.loading) return;
  if (!searchValue) {
    return;
  }

  // 添加用户输入的消息
  state.messageList.push({
    id: v4(),
    type: MessageType.User,
    content: searchValue,
  });

  const activeId = v4(); // 获取唯一的uuid

  state.messageList.push({
    id: activeId,
    type: MessageType.Chatgpt,
    loading: true,
    content: '',
  });

  let loadingTyped: Typed | null = null;
  nextTick(() => {
    loadingTyped = new Typed(`#loading-id-${activeId}`, {
      strings: ['', '加载中...'], //输入内容, 支持html标签
      typeSpeed: 50,
    });
  });

  const cloud = new Cloud({
    baseUrl: `https://${APP_ID}.laf.dev`,
    getAccessToken: () => '',
    timeout: 180000, // 由于一些问题可能会导致chatgpt思考很长时间，所以接口的超时时长要设长一些
  });

  state.loading = true;
  // 发送消息
  const res = await cloud
    .invoke('sendMessage', {
      message: searchValue,
      parentMessageId: parentMessageId.value,
    })
    .catch((err) => {
      state.loading = false;
      state.messageList = state.messageList.map((item) => {
        if (item.id === activeId) {
          return {
            ...item,
            loading: false,
            error: {
              msg: err,
            },
          };
        }
        return item;
      });
      return;
    });

  parentMessageId.value = res.id;
  const content = res.text;

  state.messageList = state.messageList.map((item) => {
    if (item.id === activeId) {
      return {
        ...item,
        loading: false,
        content,
      };
    }
    return item;
  });
  onScrollEnd();
  nextTick(() => {
    new Typed(`#text-id-${activeId}`, {
      strings: ['', marked(content)], //输入内容, 支持html标签
      typeSpeed: 5,
      showCursor: false,
      onComplete: () => {
        state.loading = false;
        onScrollEnd();
      },
    });
  });
  (loadingTyped as unknown as Typed)?.destroy(); // 销毁loading文字
};

const onScrollEnd = () => {
  nextTick(() => {
    if (scrollRef.value) {
      if (
        scrollRef.value?.scrollHeight &&
        scrollRef.value.scrollTop < scrollRef.value?.scrollHeight
      ) {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      }
    }
  });
};

onMounted(() => {
  new Typed(`#hello-chatgpt`, {
    strings: ['', `快来和chatgpt畅所欲言吧`], //输入内容, 支持html标签
    typeSpeed: 40,
  });
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
<style>
pre {
  width: 100%;
  background: #282c34;
  color: #abb2bf;
  padding: 8px;
  margin: 8px 0;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
