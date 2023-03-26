<template>
  <div v-if="message.type === MessageType.Chatgpt" class="message">
    <Avatar type="chatgpt" />
    <div :class="`message-content`">
      <div v-if="message.loading" class="message-loading">
        <div :id="`loading-id-${message.id}`"></div>
      </div>
      <div v-else-if="message.error" class="error">
        出错了：{{ message.error.msg }}，请重试
      </div>
      <div
        v-show="!message.loading"
        class="message-content-text"
        :id="`text-id-${message.id}`"
      ></div>
    </div>
  </div>
  <div v-else class="message user" :key="message.id">
    <Avatar type="user" />
    <div class="message-content">
      <div class="message-content-text">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessageType, type Message } from '@/types';
import Avatar from '../Avatar/index.vue';
type Props = {
  message: Message;
};
defineProps<Props>();
</script>

<style scoped lang="less">
.message-loading {
  padding-bottom: 48px;
  display: flex;
}

.message {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 16px;
  border-bottom: 1px solid #efefef;
  width: 100%;

  &:last-child {
    border: none;
    .message-content {
      padding-bottom: 96px;
    }
  }

  &.user {
    .message-content-text {
      color: #609966;
    }
  }

  .error {
    color: red;
  }

  .message-content {
    width: 100%;
    padding-top: 8px;
    display: flex;
    align-items: flex-end;
    flex: 1 1 auto;
    padding-bottom: 16px;
    .message-content-text {
      width: 100%;
      word-break: break-all;

      pre {
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .content {
    width: 100% !important;
    padding: 0 16px;

    .message {
      flex-direction: column;
    }

    .avatar {
      font-size: 12px;
      width: 28px !important;
      height: 28px !important;
      border-radius: 2px !important;
      .chatgpt-avatar {
        border-radius: 2px !important;
      }
    }
  }
}
</style>
