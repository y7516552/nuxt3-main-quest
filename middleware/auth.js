export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookie = useCookie("auth", {
    domain: process.VITE_COOKIE_DOMAIN,
  });
  if (!cookie.value) {
    return navigateTo("/login");
  }
  try {
    const res = await $fetch("/user/check", {
      baseURL: process.env.VITE_PUBLIC_API_URL,
      headers: {
        Authorization: cookie.value.token,
      },
    });
  } catch (error) {
    return navigateTo("/login");
  }
});
