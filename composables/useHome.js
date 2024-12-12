export const useHome = () => {
  const { $swal } = useNuxtApp();
  const newsList = ref([]);
  const roomInfo = ref({});
  const culinaryList =ref([]);
  const isLoading = ref(false);

  const getNewsList = async () => {
    isLoading.value = true
    try {
      const res = await $fetch('/home/news',{
        baseURL:process.env.PUBLIC_API_URL2
      })
      newsList.value = res.result
    }catch(error){
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得最新消息...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }finally{
      isLoading.value = false
    }
  }

  const geRandRoomInfo = async () => {
    isLoading.value = true
    try {
      const randnum = Math.floor(Math.random()*3)*1;
      const res = await $fetch('/rooms',{
        baseURL:process.env.PUBLIC_API_URL2
      })
      roomInfo.value = res.result[randnum]
    }catch(error){
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得房型資料...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }finally{
      isLoading.value = false
    }
  }

  const getCulinaryList = async () => {
    isLoading.value = true
    try {
      const res = await $fetch('/home/culinary',{
        baseURL:process.env.PUBLIC_API_URL2
      })
      culinaryList.value = res.result
    }catch(error){
      await $swal.fire({
        position: "center",
        icon: "error",
        title: "無法取得美味佳餚...",
        text: error.response._data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }finally{
      isLoading.value = false
    }
  }

  return { newsList, isLoading, getNewsList, geRandRoomInfo,getCulinaryList};
  }
