<template>
  <div>
    <AccountLogin/>
  </div>
</template>

<script setup>
import AccountLogin from '~/components/account/AccountLogin.vue';
definePageMeta({
  layout: 'account-layout'
});
</script>
