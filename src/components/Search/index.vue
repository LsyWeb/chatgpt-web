<template>
  <div class="search-container">
    <div
      v-show="state.searchHistory.length > 0"
      class="search-history"
      :class="{ active: state.isShowHistory }"
    >
      <span class="title">搜索历史</span>
      <div class="history-wrapper">
        <div
          class="item"
          v-for="item in state.searchHistory"
          :key="item"
          @mousedown="onClickItem(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="wrapper">
      <input
        v-model="state.searchValue"
        :readonly="loading"
        type="text"
        inputmode="search"
        placeholder="请输入内容"
        @keydown="onEnter"
        @blur="state.isShowHistory = false"
        @focus="state.isShowHistory = true"
      />
      <div
        class="send-btn"
        :class="{ active: state.searchValue.trim().length > 0 }"
        @click="onSearch"
      >
        {{ loading ? '发送中' : '发送' }}
      </div>
    </div>
    <div v-if="state.isShowHistory" class="loading">响应时间大约在5~15s</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
const SEARCH_HISTORY_KEY = 'chatgpt_search_history'; // 搜索历史key
type SearchProps = {
  loading: boolean;
};
defineProps<SearchProps>();

const state = reactive({
  searchValue: '',
  isShowHistory: false,
  searchHistory: JSON.parse(
    localStorage.getItem(SEARCH_HISTORY_KEY) || '[]',
  ) as string[],
  typedActiveId: '',
});

const emit = defineEmits(['sendMessage']);

const onAddSearchHistory = (value: string) => {
  if (state.searchHistory.length >= 5) {
    state.searchHistory.pop();
  }
  if (state.searchHistory.find((item) => item === value)) {
    state.searchHistory = state.searchHistory.filter((item) => item !== value);
  }
  state.searchHistory.unshift(value);
};

const onClickItem = (item: string) => {
  console.log(item);
  state.searchValue = item;
};

// 监听历史记录发生变化
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

const onEnter = (event: { keyCode: number }) => {
  if (event.keyCode === 13) {
    onSearch();
  }
};
const onSearch = () => {
  if (state.searchValue.trim()) {
    emit('sendMessage', state.searchValue);
    onAddSearchHistory(state.searchValue);
    state.searchValue = '';
    state.isShowHistory = false;
  }
};
</script>

<style lang="less" scoped>
.search-container {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 48px;
  max-width: 600px;
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  z-index: 100;
  .search-history {
    position: absolute;
    width: 100%;
    bottom: 100%;
    max-height: 168px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    transform: scaleY(0);
    transform-origin: bottom;

    .title {
      font-size: 12px;
      color: #999;
      padding-left: 8px;
      padding-top: 8px;
    }

    &.active {
      transform: scaleY(1);
    }

    .history-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      .item {
        width: 100%;
        color: #666;
        padding: 4px 8px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        white-space: nowrap;
        border-bottom: #eee 1px solid;

        &:hover {
          background-color: #eee;
        }
        &:active {
          background-color: #eee;
        }
      }
    }
  }

  .loading {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }

  .wrapper {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    padding: 8px;
    box-sizing: border-box;
    z-index: 2;

    input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
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

      &.active {
        color: #609966;
      }

      // &:hover {
      //   filter: brightness(0.4);
      // }

      // &:active {
      //   filter: brightness(0.4);
      // }
    }
  }
}

@media screen and (max-width: 500px) {
  .search-container {
    width: 92%;
    bottom: 36px;
  }
}
</style>
