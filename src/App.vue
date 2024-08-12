<script setup>
import { reactive } from "vue";
import VideoPlayer from "./components/VideoPlayer/index.vue";

const videoOptions = reactive({
  autoplay: true,
  controls: true,
});
</script>

<template>
  <video-player :options="videoOptions"></video-player>
</template>

<style>
/* 重置所有元素的边距和填充 */
* {
  margin: 0;
  padding: 0;
}

/* 重置列表样式 */
ul, ol {
  list-style: none;
}

/* 重置链接样式 */
a {
  text-decoration: none;
  color: inherit;
}

/* 重置表格样式 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* 重置图片样式 */
img {
  border: none;
}

/* 重置输入框样式 */
input, button, select, textarea {
  font-family: inherit;
  font-size: 100%;
}
</style>
