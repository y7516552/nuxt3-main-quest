export const useOrders = () => {
  const { $swal } = useNuxtApp();
  const orderList = ref([]);
  const isLoading = ref(false);
  const cookie = useCookie("auth", {
    domain: process.COOKIE_DOMAIN,
  });

  const getOrderList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/admin/orders", {
        baseURL: process.env.PUBLIC_API_URL2,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      orderList.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得訂單列表...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  

  const updateOrder = async (id,data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/orders/${id}`, {
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
      getOrderList()
    } catch (error) {
      console.log(error.response._data)
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法修改訂單...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const deleteOrder = async (id) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/orders/${id}`, {
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
      getOrderList()
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法刪除訂單...",
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
    getOrderList,
    updateOrder,
    deleteOrder,
  };
};
