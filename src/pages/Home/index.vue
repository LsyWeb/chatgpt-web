<template>
  <div class="home-container">
    <div class="text"></div>
    <div v-if="isChat" class="content">
      <template v-for="item in state.messageList">
        <template v-if="item.type === MessageType.Chatgpt">
          <div class="message-item" :key="item.id">
            <div class="avatar">Bot</div>
            <div :class="`message-item-content`">
              <div v-if="item.loading" :id="`loading-id-${item.id}`"></div>
              <div v-else-if="item.error" class="error">
                出错了：{{ item.error.msg }}，请重试
              </div>
              <div
                v-show="!item.loading"
                class="message-item-content-text"
                :id="`text-id-${item.id}`"
              ></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="message-item user" :key="item.id">
            <div class="avatar">我</div>
            <div class="message-item-content">
              <div class="message-item-content-text">
                {{ item.content }}
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <div v-else class="empty">
      <h1>开始聊天</h1>
      <div class="typed">
        <div id="hello-chatgpt"></div>
      </div>
    </div>
    <div class="input-container">
      <div class="wrapper">
        <input
          v-model="state.message"
          :readonly="state.loading"
          type="text"
          inputmode="search"
          placeholder="请输入内容"
          @keydown="onEnter"
          @focus="state.isShowHistory = true"
        />
        <div class="send-btn" @click="sendMessage">
          {{ state.loading ? '发送中' : '发送' }}
        </div>
      </div>
      <div v-if="state.isShowHistory" class="loading">响应时间大约在5~15s</div>
      <div
        v-if="state.searchHistory.length > 0"
        class="search-history"
        :class="{ active: state.isShowHistory }"
      >
        <span class="title">搜索历史</span>
        <div class="history-wrapper">
          <div
            class="item"
            v-for="item in state.searchHistory"
            :key="item"
            @click="state.message = item"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Cloud } from 'laf-client-sdk';
import { marked } from 'marked';
import 'highlight.js/styles/atom-one-dark.css';
import highjs from 'highlight.js';
import Typed from 'typed.js';
import { v4 } from 'uuid';
highjs.highlightAll();
marked.setOptions({
  highlight: function (code) {
    return highjs.highlightAuto(code).value;
  },
});

enum MessageType {
  User = 'user',
  Chatgpt = 'chatgpt',
}
type Message = {
  id: string;
  type: MessageType;
  content?: string;
  loading?: boolean;
  error?: {
    msg?: string;
  };
};
const SEARCH_HISTORY_KEY = 'chatgpt_search_history';

const state = reactive({
  loading: false,
  message: '',
  messageList: [] as Message[],
  isShowHistory: false,
  searchHistory: JSON.parse(
    localStorage.getItem(SEARCH_HISTORY_KEY) || '[]',
  ) as string[],
});
const isChat = computed(() => state.messageList.length > 0);

const parentMessageId = ref('');

const onAddSearchHistory = (value: string) => {
  if (state.searchHistory.length >= 5) {
    state.searchHistory.pop();
  }
  if (state.searchHistory.find((item) => item === value)) {
    state.searchHistory = state.searchHistory.filter((item) => item !== value);
  }
  state.searchHistory.unshift(value);
};

watch(
  () => state.searchHistory,
  () => {
    localStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(state.searchHistory),
    );
  },
  {
    deep: true,
  },
);

const sendMessage = async () => {
  if (state.loading) return;
  if (!state.message) {
    return;
  }

  state.messageList.push({
    id: v4(),
    type: MessageType.User,
    content: state.message,
  });

  onAddSearchHistory(state.message);

  const activeId = v4();

  state.messageList.push({
    id: activeId,
    type: MessageType.Chatgpt,
    loading: true,
    content: '',
  });

  let loadingTyped: Typed | null = null;
  nextTick(() => {
    console.log(document.querySelector(`#loading-id-${activeId}`));
    loadingTyped = new Typed(`#loading-id-${activeId}`, {
      strings: ['', '加载中...'], //输入内容, 支持html标签
      typeSpeed: 50,
    });
  });

  const cloud = new Cloud({
    baseUrl: 'https://f6x6ul.laf.dev',
    getAccessToken: () => '',
    timeout: 180000,
  });

  let res;
  state.loading = true;
  // 与云函数逻辑一样，有上下文 id 就传入
  if (!parentMessageId.value) {
    res = await cloud
      .invoke('sendMessage', { message: state.message })
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
  } else {
    res = await cloud
      .invoke('sendMessage', {
        message: state.message,
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
  }

  parentMessageId.value = res.id;
  const content = res.text;
  nextTick(() => {
    new Typed(`#text-id-${activeId}`, {
      strings: ['', marked(content)], //输入内容, 支持html标签
      typeSpeed: 10,
      showCursor: false,
      onComplete: () => {
        state.loading = false;
        state.message = '';
      },
    });
  });
  (loadingTyped as unknown as Typed)?.destroy();
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
  state.isShowHistory = false;
};

onMounted(() => {
  new Typed(`#hello-chatgpt`, {
    strings: ['', `快来和chatgpt畅所欲言吧`], //输入内容, 支持html标签
    typeSpeed: 50,
  });
});

const onEnter = (event: { keyCode: number }) => {
  if (event.keyCode === 13) {
    sendMessage();
  }
};
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
  white-space: pre-wrap;
}
</style>
