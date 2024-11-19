
<script setup lang="js">
import { Icon } from '@iconify/vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
const route = useRoute()
console.log('route',route)


const modules = ref([Autoplay, Navigation, Pagination]);


const importImage = (url) => {
  const image = new URL(url, import.meta.url);
  return image.href;
}

const roomImages = computed(() => {
  const rooms = ['a', 'b', 'c', 'd'];
  const nums = [1, 2, 3, 4, 5];

  const result = rooms.reduce((acc, roomId) => {
    acc[`room${roomId.toUpperCase()}`] = nums.reduce((obj, num) => {
      obj[num] = {
        desktop: importImage(`../assets/images/room-${roomId}-${num}.png`),
        mobile: importImage(`../assets/images/room-${roomId}-sm-${num}.png`)
      };
      return obj;
    }, {});

    return acc;
  }, {});

  return result;
})


</script>

<template>
  <main>
    <NuxtPage/>
  </main>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px
);

.hero img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(40%);
}

.hero-wrapper {
  inset: 0;
}

.deco-line {
  width: 33vw;
  height: 2px;
  background-image: linear-gradient(to right, #BE9C7C, #FFFFFF);
}

.hero .deco-line {
  @include media-breakpoint-down(md) {
    width: 2px;
    height: 83px;
    z-index: 1;
    background-image: linear-gradient(to bottom, #BE9C7C, #FFF);
    margin-bottom: 2.5rem;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.card-info {
  width: 97px;
  height: 97px;
}

.swiper {
  display: grid;
}
.swiper :deep(.swiper-wrapper) {
  min-width: 0;
}

.swiper :deep(.swiper-button-prev),
.swiper :deep(.swiper-button-next) {
  width: 56px;
  height: 56px;
  background-color: #FFFFFF;
  color: #4B4B4B;
  border-radius: 100px;

  @include media-breakpoint-down(md) {
    display: none;
  }
}

.swiper :deep(.swiper-button-prev::after),
.swiper :deep(.swiper-button-next::after) {
  font-size: 40px;
}

.swiper :deep(.swiper-button-prev::after) {
  display: inline-block;
  width: 1em;
  height: 1em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.swiper :deep(.swiper-button-next::after) {
  display: inline-block;
  width: 1em;
  height: 1em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.hero .swiper :deep(.swiper-pagination) {
  bottom: 32px;
}

.swiper :deep(.swiper-pagination) {
  bottom: 24px;
}

.swiper :deep(.swiper-pagination-bullet) {
  width: 32px;
  height: 4px;
  background-color: #F1EAE4;
  border-radius: 100px;
  opacity: 1;
}

.swiper :deep(.swiper-pagination-bullet-active) {
  width: 60px;
  background-color: #BF9D7D;
}

</style>
