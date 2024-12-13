export const useNews = () => {
  const { $swal } = useNuxtApp();
  const newsList = ref([]);
  const isLoading = ref(false);
  const cookie = useCookie("auth", {
    domain: process.COOKIE_DOMAIN,
  });

  const getNewsList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/admin/news", {
        baseURL: process.env.PUBLIC_API_URL2,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      newsList.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得最新消息列表...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };


  const createNews = async (data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/news/`, {
        method:'POST',
        baseURL: process.env.PUBLIC_API_URL2,
        headers: {
          Authorization: cookie.value?.token,
        },
        body:data
      });
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "新增成功",
        showConfirmButton: false,
        timer: 1500,
      });
      getNewsList()
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法新增最新消息...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const updateNews = async (id,data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/news/${id}`, {
        method:'PUT',
        baseURL: process.env.PUBLIC_API_URL2,
        headers: {
          Authorization: cookie.value?.token,
        },
        body:data
      });
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "修改成功",
        showConfirmButton: false,
        timer: 1500,
      });
      getNewsList()
    } catch (error) {
      console.log(error.response._data)
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法修改最新消息...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const deleteNews = async (id) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/news/${id}`, {
        method:'DELETE',
        baseURL: process.env.PUBLIC_API_URL2,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "刪除成功",
        showConfirmButton: false,
        timer: 1500,
      });
      getNewsList()
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法刪除最新消息...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    isLoading,
    newsList,
    getNewsList,
    createNews,
    updateNews,
    deleteNews,
  };
};
