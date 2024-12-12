<script setup >
import UserProfile from '~/components/user/UserProfile.vue';
definePageMeta({
  layout: "user-layout",
  middleware: ["auth"],
});
</script>

<template>
  <div >
    <UserProfile/>
  </div>
  
</template>

