const apiUrl = process.env.VITE_PUBLIC_API_URL;

export const useHome = () => {
  const { $swal } = useNuxtApp();
  const newsList = ref([]);
  const roomsInfo = ref({});
  const culinaryList = ref([]);
  const isLoading = ref(false);

  const getNewsList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/home/news", {
        baseURL: apiUrl,
      });
      newsList.value = res.result;
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

  const roomsData = ref([]);

  const getRooms = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/rooms", {
        baseURL: apiUrl,
      });
      roomsData.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得房型資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const roomData = ref({});

  const geRoomInfo = async (id) => {
    isLoading.value = true;
    try {
      const res = await $fetch(`/rooms/${id}`, {
        baseURL: apiUrl,
      });
      roomData.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得房型資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const getCulinaryList = async () => {
    isLoading.value = true;
    try {
      const res = await $fetch("/home/culinary", {
        baseURL: apiUrl,
      });
      culinaryList.value = res.result;
    } catch (error) {
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得美味佳餚...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    newsList,
    isLoading,
    roomsInfo,
    roomsData,
    roomData,
    getNewsList,
    getRooms,
    geRoomInfo,
    getCulinaryList,
  };
};
