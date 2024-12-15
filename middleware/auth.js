export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookie = useCookie("auth");
  if (!cookie.value) {
    return navigateTo("/login");
  }
  try {
    const res = await $fetch("/user/check", {
      baseURL: process.env.PUBLIC_API_URL,
      headers: {
        Authorization: cookie.value.token,
      },
    });
  } catch (error) {
    return navigateTo("/login");
  }
});
