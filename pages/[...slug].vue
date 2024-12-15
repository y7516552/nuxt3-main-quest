<script setup>
const router = useRouter();
const route = useRoute();
const event = useRequestEvent();
setResponseStatus(event, 404);

</script>

<template>
    <section class="d-flex flex-column justify-content-center align-items-center text-white bg-primary-100" style="height: 50vw;">
        <h1 class="">404 Not Found</h1>
        <p>{{ route.params.slug }}</p>
        <button class="btn btn-outline-dark" @click="router.push('/')"> 回到首頁</button>
    </section>
</template>