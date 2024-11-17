<script setup >
import AppHeader from '@/components/global/AppHeader';
import AppFooter from '@/components/global/AppFooter';
</script>

<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<style scoped></style>
