<script setup >
import AppHeader from '@/components/global/AppHeader';
import AppFooter from '@/components/global/AppFooter';
</script>

<template>
  <div>
    <AppHeader />
    <div>
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
