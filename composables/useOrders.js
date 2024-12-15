const apiUrl = process.env.VITE_PUBLIC_API_URL;

export const useOrders = () => {
  const { $swal } = useNuxtApp();
  const orderList = ref([]);
  const isLoading = ref(false);
  const cookie = useCookie("auth", {
    domain: process.VITE_COOKIE_DOMAIN,
  });

  const getOrderList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/admin/orders", {
        baseURL: apiUrl,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      const all = [...res.result];
      const oncoming = res.result.filter(
        (order) => new Date(order.checkInDate) > new Date()
      );
      oncoming.sort(
        (a, b) =>
          new Date(a.checkInDate) - new Date(b.checkInDate) ||
          new Date(a.checkOutDate) - new Date(b.checkOutDate)
      );

      const today = res.result.filter(
        (order) =>
          new Date(order.checkInDate) <= new Date() &&
          new Date(order.checkOutDate) >= new Date()
      );
      today.sort(
        (a, b) =>
          new Date(a.checkInDate) - new Date(b.checkInDate) ||
          new Date(a.checkOutDate) - new Date(b.checkOutDate)
      );

      const historyOrders = res.result.filter(
        (order) =>
          new Date(order.checkInDate) < new Date() &&
          new Date(order.checkOutDate) < new Date()
      );
      historyOrders.sort(
        (a, b) =>
          new Date(a.checkInDate) - new Date(b.checkInDate) ||
          new Date(a.checkOutDate) - new Date(b.checkOutDate)
      );
      orderList.value = [
        { title: "今日", data: today },
        { title: "即將到來", data: oncoming },
        { title: "歷史訂單", data: historyOrders },
        { title: "全部訂單", data: all },
      ];
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

  const updateOrder = async (id, data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/orders/${id}`, {
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
      getOrderList();
    } catch (error) {
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
      getOrderList();
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
    orderList,
    getOrderList,
    updateOrder,
    deleteOrder,
  };
};
