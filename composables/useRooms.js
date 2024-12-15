const apiUrl = process.env.PUBLIC_API_URL;

export const useRooms = () => {
  const { $swal } = useNuxtApp();
  const roomsList = ref([]);
  const isLoading = ref(false);
  const cookie = useCookie("auth", {
    domain: process.env.COOKIE_DOMAIN,
  });

  const getRoomsList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/admin/rooms", {
        baseURL: apiUrl,
        headers: {
          Authorization: cookie.value?.token,
        },
      });
      roomsList.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得房型列表...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const createRoom = async (data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/rooms/`, {
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
      getRoomsList();
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法新增房型資訊...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const updateRoom = async (id, data) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/rooms/${id}`, {
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
      getRoomsList();
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法修改房型資訊...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRoom = async (id) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/admin/rooms/${id}`, {
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
      getRoomsList();
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法刪除房型資訊...",
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
    roomsList,
    getRoomsList,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
