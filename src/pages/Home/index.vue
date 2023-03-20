<template>
  <div class="home-container">
    <div v-if="isChat" class="content">
      <template v-for="item in state.messageList">
        <template v-if="item.type === MessageType.Chatgpt">
          <div class="message-item" :key="item.id">
            <div class="avatar">Bot</div>
            <div class="message-item-content">
              <div v-if="item.loading">加载中...</div>
              <div v-else-if="item.error" class="error">出错了：{{ item.error.msg }}，请重试</div>
              <div v-else class="message-item-content-text" v-html="marked(item.content || '')"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="message-item user" :key="item.id">
            <div class="avatar">User</div>
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
      <p>和chatgpt畅所欲言吧</p>
    </div>
    <div class="input-container">
      <div class="wrapper">
        <input
          v-model="state.message"
          :readonly="state.loading"
          type="text"
          placeholder="请输入内容"
          @keydown="onEnter"
          @focus="state.isShowHistory = true"
        />
        <div class="send-btn" @click="sendMessage">
          {{ state.loading ? '发送中' : '发送' }}
        </div>
      </div>
      <div v-if="state.isShowHistory" class="loading">响应时间大约在5~15s</div>
      <div v-if="state.searchHistory.length > 0" class="search-history" :class="{ active: state.isShowHistory }">
        <span class="title">搜索历史</span>
        <div class="history-wrapper">
          <div class="item" v-for="item in state.searchHistory" :key="item" @click="state.message = item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Cloud } from 'laf-client-sdk';
import { marked } from 'marked';
import 'highlight.js/styles/atom-one-dark.css';
import highjs from 'highlight.js';
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
  searchHistory: JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]') as string[],
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
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(state.searchHistory));
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
    id: String(state.messageList.length + 1),
    type: MessageType.User,
    content: state.message,
  });

  onAddSearchHistory(state.message);

  const activeId = String(state.messageList.length + 1);

  state.messageList.push({
    id: activeId,
    type: MessageType.Chatgpt,
    content: '加载中...',
    loading: true,
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
    res = await cloud.invoke('sendMessage', { message: state.message }).catch((err) => {
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
  state.loading = false;
  parentMessageId.value = res.id;
  console.log(res, 'res');
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
  state.isShowHistory = false;
  state.message = '';
};

const onEnter = (event: { keyCode: number }) => {
  if (event.keyCode === 13) {
    sendMessage();
  }
};
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    flex: 1 1 auto;
    width: 80%;
    min-width: 300px;
    max-width: 800px;
    overflow-y: auto;
    padding: 0 16px;
    .message-item {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding-bottom: 16px;
      padding-top: 16px;
      border-bottom: 1px solid #efefef;

      &.user {
        .message-item-content-text {
          color: #609966;
        }
      }
      .error {
        color: red;
      }
      .message-item-content {
        padding-top: 12px;
      }
      .avatar {
        width: 48px;
        height: 48px;
        flex: 0 0 auto;
        border-radius: 50%;
        background-color: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 16px;
      }
    }
  }
  @media screen and (max-width: 500px) {
    .content {
      width: 100%;
    }
  }
  .empty {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
  }
  .input-container {
    width: 500px;
    height: 96px;
    padding: 8px 16px;
    margin: 64px 0 48px 0;
    flex: 0 0 auto;

    .search-history {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 16px;
      transform: translateY(-50px);
      opacity: 0;
      transition: all 0.3s;
      z-index: 1;

      .title {
        font-size: 12px;
        color: #999;
      }
      &.active {
        transform: translateY(-144px);
        opacity: 1;
      }
      .history-wrapper {
        width: 100%;
        display: flex;
        overflow-x: auto;
        padding: 8px 0;
        .item {
          color: #333;
          flex: 0 0 auto;
          min-width: 50px;
          text-align: center;
          max-width: 200px;
          background-color: rgb(229, 245, 231);
          padding: 4px 8px;
          border-radius: 20px;
          margin-right: 8px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          white-space: nowrap;
          &:hover {
            filter: brightness(0.95);
          }
        }
      }
    }
    .loading {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
    .wrapper {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 8px;
      box-sizing: border-box;
      background-color: #fff;
      z-index: 2;

      input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        border-radius: 4px;
        font-size: 16px;
        color: #666;
      }
      .send-btn {
        width: 72px;
        display: flex;
        justify-content: center;
        color: #999;
        cursor: pointer;
        user-select: none;
        &:hover {
          filter: brightness(0.4);
        }
        &:active {
          filter: brightness(0.4);
        }
      }
    }
  }
  @media screen and (max-width: 500px) {
    .input-container {
      width: 300px;
      height: 36px;
      input {
        height: 36px;
      }
    }
  }
}
</style>
