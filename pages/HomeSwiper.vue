<script setup >
const containerRef = ref(null)
const slides = ref(Array.from({ length: 5 }))

const swiper = useSwiper(containerRef, {
  effect: 'creative',
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
})

onMounted(() => {
  console.log(swiper.instance)
})
  
</script>

<template>
  <div>
    <!-- -->
    <ClientOnly>
      <swiper-container ref="containerRef">
        <swiper-slide
          v-for="(num, index) in slides"
          :key="index"
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
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<style lang="scss">
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  height: 120vh;
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
</style>
