const apiUrl = process.env.VITE_PUBLIC_API_URL;

export const useCulinary = () => {
  const { $swal } = useNuxtApp();
  const culinaryList = ref([]);
  const isLoading = ref(false);
  const cookie = useCookie("auth", {
    domain: process.VITE_COOKIE_DOMAIN,
  });

  const getCulinaryList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/admin/culinary", {
        baseURL: apiUrl,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      culinaryList.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得最新消息...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const createCulinary = async (data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/culinary/`, {
        method: "POST",
        baseURL: apiUrl,
        headers: {
          Authorization: cookie.value?.token,
        },
        body: data,
      });
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "新增成功",
        showConfirmButton: false,
        timer: 1500,
      });
      getCulinaryList();
    } catch (error) {
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

  const updateCulinary = async (id, data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/culinary/${id}`, {
        method: "PUT",
        baseURL: apiUrl,
        headers: {
          Authorization: cookie.value?.token,
        },
        body: data,
      });
      await $swal.fire({
        position: "center",
        icon: "success",
        title: "修改成功",
        showConfirmButton: false,
        timer: 1500,
      });
      getCulinaryList();
    } catch (error) {
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

  const deleteCulinary = async (id) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/culinary/${id}`, {
        method: "DELETE",
        baseURL: apiUrl,
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
      getCulinaryList();
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
    culinaryList,
    getCulinaryList,
    createCulinary,
    updateCulinary,
    deleteCulinary,
  };
};
