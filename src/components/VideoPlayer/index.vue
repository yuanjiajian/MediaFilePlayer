<script setup>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import http from "../../api";
const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
});

const videoPlayer = ref(null);
let player = null;
const isOpenVideoPlayerList = ref(true);
const state = reactive({
  videoPlayerList: [],
  currentVideo: null,
});

//获取全部视频列表
const queryAll = () => {
  return new Promise((resolve, reject) => {
    http
      .get("/queryAll")
      .then((res) => {
        state.videoPlayerList = res.files;
        resolve();
      })
      .catch((error) => {
        console.log(error.message);
        reject();
      });
  });
};

//创建视频列表按钮
const createVideoListButton = () => {
  const videoListButton = player.controlBar.addChild("button");
  const videoListButtonDom = videoListButton.el();
  videoListButtonDom.innerHTML = "列表";
  videoListButtonDom.style.cursor = "pointer";
  videoListButton.addClass("videoListButtonClass");
  videoListButtonDom.onclick = () => {
    isOpenVideoPlayerList.value = !isOpenVideoPlayerList.value;
  };
};
//加载当前视频
const loadCurrentVideo = (data, isPlay) => {
  state.currentVideo = data;
  const _data = {
    src: `${import.meta.env.BASE_API}/${data.name}`,
    type: `video${data.type.replace(".", "/")}`,
  };
  player.src(_data);
  player.load(_data);
  if (isPlay) {
    player.play();
  }
};
onMounted(() => {
  player = videojs(videoPlayer.value, props.options, async () => {
    player.log("onPlayerReady", player);
    await queryAll();
    createVideoListButton();
    loadCurrentVideo(state.currentVideo || state.videoPlayerList[0]);
  });
  player.on("ended", () => {
    const currentIndex = state.videoPlayerList.findIndex(
      (item) => item.name === state.currentVideo?.name
    );
    const nextVideo = state.videoPlayerList[currentIndex + 1] || null;
    if (nextVideo) {
      loadCurrentVideo(nextVideo, true);
    }
  });
});
onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});
</script>

<template>
  <div class="videoPlayerContainer">
    <video ref="videoPlayer" class="video-js"></video>
    <div class="videoPlayerList" v-if="isOpenVideoPlayerList">
      <div
        :class="[
          'item',
          state.currentVideo?.name === item.name ? 'active' : '',
        ]"
        v-for="(item, i) in state.videoPlayerList"
        :key="i"
        @click="loadCurrentVideo(item, true)"
      >
        <div class="leftCon">
          <img class="thumbnail" />
        </div>
        <div class="rightCon">
          <p class="title">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.videoPlayerContainer {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.videoPlayerContainer .video-js {
  flex: 3;
  min-width: 75vw;
  height: 100%;
}
.videoPlayerContainer .video-js :deep(.vjs-control-bar) {
  display: flex;
}
.videoPlayerContainer .videoPlayerList {
  flex: 1;
  min-width: 25vw;
  height: 100%;
  background-color: #303030;
  overflow: auto;
}
.videoPlayerContainer .videoPlayerList .item {
  padding: 10px;
  display: flex;
  align-items: center;
  transition: background-color 0.8s ease; /* 添加过渡效果 */
  cursor: pointer;
}
.videoPlayerContainer .videoPlayerList .item:hover {
  background-color: #f5f7fa;
}
.videoPlayerContainer .videoPlayerList .item:hover .rightCon p.title {
  color: #606266;
}
.videoPlayerContainer .videoPlayerList .item.active {
  background-color: #409eff;
}
.videoPlayerContainer .videoPlayerList .item.active .rightCon p.title {
  color: #fff;
}
.videoPlayerContainer .videoPlayerList .item .leftCon {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.videoPlayerContainer .videoPlayerList .item .leftCon img.thumbnail {
  width: 50px;
  height: 50px;
}
.videoPlayerContainer .videoPlayerList .item .rightCon {
  width: calc(100% - 50px);
}
.videoPlayerContainer .videoPlayerList .item .rightCon p.title {
  width: 100%;
  display: block;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #fff;
  overflow: hidden; /* 隐藏溢出的文本 */
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 溢出部分用省略号表示 */
}
</style>