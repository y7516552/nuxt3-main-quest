import { defineStore } from "pinia";
const apiUrl = process.env.PUBLIC_API_URL2;
export const useLogingStore = defineStore("login", () => {
  const { $swal } = useNuxtApp();
  const router = useRouter();
  const route = useRoute();
  const cookie = useCookie("auth", {
    domain: process.COOKIE_DOMAIN,
  });

  const error_message = ref({
    username: "",
    password: "",
  });

  const isLoading = ref(false);

  const isLogin = ref(false);

  const loginUser = ref({});

  const handleLoading = () => (isLoading.value = !isLoading.value);

  const sendLoginAuth = async ({ email, password }) => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      // https://vue-lessons-api.vercel.app
      const res = await $fetch("/user/login", {
        baseURL: apiUrl,
        method: "POST",
        body: { email, password },
      });

      // save token
      cookie.value = { token: res.token };

      loginUser.value = res.result;
      isLogin.value = true;
      if (route.query.isOpen) {
        window.open("", "_self").close();
      }
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "登入成功",
        showConfirmButton: false,
        timer: 1500,
      });
      navigateTo("/");
    } catch (error) {
      error_message.value = error.response._data.message;
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "登入失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    cookie.value = null;
    isLogin.value = false;
    loginUser.value = {};
    navigateTo("/");
  };

  const checkAuth = async () => {
    isLoading.value = true;
    if (!cookie.value) return;
    try {
      const res = await $fetch("/user/check", {
        baseURL: apiUrl,
        method: "GET",
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      isLogin.value = true;
    } catch (error) {
      cookie.value = null;
      isLogin.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const signup = async (userData) => {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
      // https://vue-lessons-api.vercel.app
      const res = await $fetch("/user/signup", {
        baseURL: apiUrl,
        method: "POST",
        body: { ...userData },
      });

      // save token
      cookie.value = { token: res.token };
      loginUser.value = res.result;
      isLogin.value = true;
      router.replace("/");
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "註冊成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      error_message.value = error.response._data.message;

      await $swal.fire({
        position: "center",
        icon: "error",
        title: "註冊失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload();
    } finally {
      isLoading.value = false;
    }
  };

  const getUser = async () => {
    // https://vue-lessons-api.vercel.app
    if (!cookie.value) return;
    try {
      const res = await $fetch("/user/", {
        baseURL: apiUrl,
        method: "GET",
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      loginUser.value = res.result;
    } catch (error) {
      error_message.value = error.response._data.message;
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "用戶資料取得失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
      // router.replace({path:'/login'})
      // cookie.value = null
      // isLogin.value = false
    }
  };

  const updateUser = async (data) => {
    // https://vue-lessons-api.vercel.app
    if (!cookie.value) return;
    try {
      const res = await $fetch("/user/", {
        baseURL: apiUrl,
        method: "PUT",
        headers: {
          Authorization: cookie.value?.token,
        },
        body: data,
      });
      getUser();

      await $swal.fire({
        position: "center",
        icon: "success",
        title: "修改成功",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      error_message.value = error.response._data.message;
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "修改失敗",
        text: error_message.value,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return {
    isLoading,
    isLogin,
    loginUser,
    handleLoading,
    sendLoginAuth,
    logout,
    checkAuth,
    signup,
    getUser,
    updateUser,
    error_message,
  };
});
