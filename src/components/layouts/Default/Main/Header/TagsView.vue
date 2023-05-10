<script lang="tsx" setup>
import { ref, watch, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useTagsViewStore } from '@/store/tagsView'
import { useRouter, useRoute } from 'vue-router'

const tagsViewStore = useTagsViewStore()
const router = useRouter()
const route = useRoute()

const scrollRef = ref(null)
watch(
  () => route.meta?.title,
  (nTitle) => {
    if (nTitle) {
      tagsViewStore.addVisitedRoutes(route)
    }
  },
  { immediate: true }
)

const onDelete = (tag: any) => {
  tagsViewStore.deleteVisitedRoutes(tag, { router, route })
}

const contextmenuState = reactive({
  visible: false,
  route: null,
  event: null,
  style: {},
  openMenu(route: any, event: any) {
    event = event || window.event
    contextmenuState.route = route
    contextmenuState.event = event

    const { clientX, clientY, pageX, pageY } = event
    const left = clientX || pageX
    const top = clientY || pageY
    contextmenuState.style = { left: `${left}px`, top: `${top}px` }

    contextmenuState.visible = true
  },
  closeOtherTags() {
    tagsViewStore.deleteOtherRoutes(contextmenuState.route)
  },
  closeLeftTags() {
    tagsViewStore.deleteLeftRoutes(contextmenuState.route)
  },
  closeRightTags() {
    tagsViewStore.deleteRightRoutes(contextmenuState.route)
  },
  closeMenu() {
    contextmenuState.visible = false
  }
})

const scrollLeft = ref(0)
const onScroll = (params: { scrollLeft: number }) => {
  scrollLeft.value = params.scrollLeft
}

onMounted(() => {
  document.addEventListener('click', contextmenuState.closeMenu)
  ;(scrollRef.value as any).wrapRef.addEventListener('wheel', (evt: WheelEvent) => {
    evt.preventDefault()
    ;(scrollRef.value as any).setScrollLeft(scrollLeft.value + evt.deltaY)
  })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', contextmenuState.closeMenu)
})
</script>

<template>
  <div class="tags-view">
    <el-scrollbar ref="scrollRef" :vertical="false" @scroll="onScroll">
      <div class="flex">
        <template v-for="tag in tagsViewStore.visitedRoutes" :key="tag.path || tag.name">
          <router-link
            class="router-item"
            :to="{ path: tag.path, query: tag.query }"
            @contextmenu.prevent="(event: any) => contextmenuState.openMenu(tag, event)"
          >
            {{ tag.meta.title }}
            <i-ep-close class="icon-close" @click.prevent="onDelete(tag)"></i-ep-close>
          </router-link>
        </template>
        <teleport to="body">
          <ul v-show="contextmenuState.visible" class="contextmenu" :style="contextmenuState.style">
            <li @click="contextmenuState.closeOtherTags">关闭其他标签</li>
            <li @click="contextmenuState.closeLeftTags">关闭左侧标签</li>
            <li @click="contextmenuState.closeRightTags">关闭右侧标签</li>
          </ul>
        </teleport>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.tags-view {
  .router-item {
    @apply flex items-center;
    margin: 5px;
    padding: 2px 5px;
    border: 1px solid #d8dce5;
    border-radius: 2px;
    flex-shrink: 0;
    background: #fff;

    &.router-link-active {
      background-color: #42b983;
      border-color: #42b983;
      color: #fff;

      &::before {
        content: '';
        margin-right: 4px;
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
      }
    }

    .icon-close {
      padding: 2px;
      border-radius: 50%;
      transform: scale(0.8);

      &:hover {
        background-color: #aaa;
        color: #fff;
      }
    }
  }
}

.contextmenu {
  position: fixed;
  width: 90px;
  background: #fff;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
  padding: 5px 0;
  font-size: 12px;
  text-align: center;

  li {
    line-height: 30px;
    cursor: pointer;

    &:hover {
      background: #f2f2f2;
    }
  }
}
</style>
