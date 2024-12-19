<script setup>
import Swiper from '../components/swiper/Swiper.vue'
import SwiperSlide  from '../components/swiper/SwiperSlide'
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const modules = ref([Autoplay, Navigation, Pagination]);



const isLooping = ref(false);
</script>
<template>
  <div>
    <section class="hero position-relative">
      
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :autoplay="false"
        :navigation="{
          enabled:false
        }"
        :pagination="false"
        :loop="false"
      >
        <SwiperSlide
          v-for="num in 5"
          :key="num"
        >
          <picture>
            <source
              srcset="@/assets/images/home-hero.png"
              media="(min-width:576px)"
            >
            <img
              class="hero-img"
              src="@/assets/images/home-hero-sm.png"
              alt="hero banner"
            >
          </picture>
        </SwiperSlide>
      </Swiper>

      <div class="hero-wrapper d-flex flex-column justify-content-center align-items-center flex-md-row justify-content-md-between gap-md-10 w-100 px-md-20 position-absolute z-2">
        <div class="d-flex flex-column align-items-center text-center d-md-block text-md-start">
          <div class="mt-10 mb-5 mt-md-0 mb-md-10 text-primary-100 fw-bold">
            <h2>
              享樂酒店
            </h2>
            <h5 class="mb-0 fs-7 fs-md-5">
              Enjoyment Luxury Hotel
            </h5>
          </div>
          <div class="deco-line" />
        </div>
        <div class="hero__intro position-relative">
          <div class="hero__intro-content">
            <h1 class="mb-6 text-white fw-bold text-nowrap">
              高雄<br>豪華住宿之選
            </h1>
            <p class="text-neutral-40 fw-semibold">
              我們致力於為您提供無與倫比的奢華體驗與優質服務
            </p>
            <NuxtLink 
              to="/admin/rooms"
              class="btn btn-neutral-0 d-flex justify-content-end align-items-center gap-3 w-100 text-end text-neutral-100 fs-5 fw-semibold border-0"
            >
              房型管理
              <div class="cta-deco" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
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

section .btn {
  --primary: #BF9D7D;
  --neutral: #FFFFFF;
  height: clamp(4rem, 12vh, 7.25rem);
  padding: 5%;

  &:hover {
    box-shadow: inset 48vw 0 0 0 var(--primary);
    color: var(--neutral) !important;
    transition-duration: 0.25s;

    .cta-deco {
      background-color: var(--neutral) !important;
      width: 8vw;
    }
  }

  @include media-breakpoint-down(md) {
    height: 4rem;
  }
}
.cta-deco {
  width: 10vw;
  height: 1px;
  background-color: #000;
  transition: background-color 0.25s ease-in-out, width 0.25s ease-in-out;

  @include media-breakpoint-down(md) {
    width: 5rem;
  }
}

.hero img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(40%);
}

.hero-wrapper {
  inset: 0;
}

.hero__intro {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: clamp(291px, 48vw, 924px);
  max-height: min(62vh, 672px);
  padding: 5.5%;
  background-image: linear-gradient(to bottom, #FFFFFF00, #FFFFFF4D);
  border-width: 1px 1px 0px 0px;
  border-style: solid;
  border-color: #F5F7F9;
  border-radius: 80px;
  backdrop-filter: blur(6px);

  @include media-breakpoint-down(md) {
    transform: translateX(10%);
    height: 420px;
  }
}

.hero__intro-content {
  max-width: 39vw;
  transform: translateX(-18%);

  @include media-breakpoint-down(md) {
    max-width: none;
    transform: translateX(-11%);
  }
}

.hero__intro-content h1 {
  font-size: clamp(3rem, 5.2vw, 6.25rem);
}
.hero__intro-content p {
  font-size: clamp(1rem, 1.7vw, 2rem);
  margin-bottom: min(5vh, 3.75rem);
  white-space: nowrap;

  @include media-breakpoint-down(md) {
    white-space: normal;
  }
}

</style>