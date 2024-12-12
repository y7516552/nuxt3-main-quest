export default defineNuxtRouteMiddleware(async (to, from) => {
  const cookie = useCookie("auth",{
    domain:process.COOKIE_DOMAIN
  })
    if (!cookie.value) {
        return navigateTo("/login");
    }
    try{
      const res = await $fetch("/user/check", {
        baseURL: process.env.PUBLIC_API_URL2,
        headers:{
          Authorization: cookie.value.token
        }
      });
    }catch(error){
      return navigateTo("/login");
    }
})