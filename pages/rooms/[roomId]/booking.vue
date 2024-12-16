<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { useScreens } from "vue-screen-utils";
import BookingLoading from "@/components/rooms/BookingLoading.vue";
import { ZipCodeMap, cityList } from "~/utils/zipcodes";

definePageMeta({
  middleware: ["auth"],
});

const { $swal } = useNuxtApp();
const bookingStore = useBookingStore();
const { isLoading, roomData, bookingInfo } = storeToRefs(bookingStore);
const { getRoomData, createOrder } = bookingStore;

const loginStore = useLogingStore();
const { loginUser } = storeToRefs(loginStore);

const {roomsData,getRooms} = useHome()
getRooms()

const route = useRoute();
const roomId = route.params.roomId;
getRoomData(roomId);
const router = useRouter();

if (!bookingInfo.value.checkOutDate) {
  router.push({
    name: "rooms-roomId",
    params: {
      roomId: roomId,
    },
  });
}
const roomSelected = computed(()=> roomsData.value.find((room) => room._id == bookingInfo.value.roomId))
const maxPeople = roomSelected?.value?.maxPeople ||4

const generateLocaleDateRange = () => {
  const currentDate = new Date();

  const startDate = currentDate.toLocaleDateString().replaceAll("/", "-");

  // currentDate 的下一天
  let endDate = new Date(currentDate);
  endDate.setDate(currentDate.getDate() + 1);
  endDate = endDate.toLocaleDateString().replaceAll("/", "-");

  // 明年的同一天
  const nextYear = new Date(currentDate).setFullYear(
    currentDate.getFullYear() + 1
  );

  return {
    startDate,
    endDate,
    nextYear,
  };
};

const { startDate, endDate, nextYear } = generateLocaleDateRange();

const bookingDate = ref({
  start:  bookingInfo.value.checkInDate||startDate,
  end: bookingInfo.value.checkOutDate||endDate,
});

const minDate = null;
const maxDate = new Date(nextYear);
const masks = {
  title: "YYYY 年 MM 月",
  modelValue: "YYYY-MM-DD",
  input: "YYYY-MM-DD",
};

const { mapCurrent } = useScreens({
  md: "768px",
});

const rows = mapCurrent({ md: 1 }, 2);
const columns = mapCurrent({ md: 2 }, 1);
const expanded = mapCurrent({ md: false }, true);
const titlePosition = mapCurrent({ md: "center" }, "left");

const dateFormat = (value) => {
  const month = new Date(value).getMonth();
  const date = new Date(value).getDate();
  const day = new Date(value).getDay();
  let weekday = "";

  if (day === 0) weekday = "日";
  if (day === 1) weekday = "一";
  if (day === 2) weekday = "二";
  if (day === 3) weekday = "三";
  if (day === 4) weekday = "四";
  if (day === 5) weekday = "五";
  if (day === 6) weekday = "六";
  const string = month + 1 + " 月 " + date + " 日" + " 星期" + weekday;
  return string;
};

const isRoomIdEdit = ref(false);
const isDateIdEdit = ref(false);
const isBookingPeopleIdEdit = ref(false);

const price = bookingInfo.value.price * 1 || 10000;
const checkInDate = ref(bookingInfo.value.checkInDate || new Date());
const checkOutDate = ref(bookingInfo.value.checkOutDate || new Date());
const checkInFormat = computed(()=> dateFormat(checkInDate.value));
const checkOutFormat = computed(()=> dateFormat(checkOutDate.value));
const daysCount = bookingInfo.value.daysCount * 1 || 1;
const subtotal = price * daysCount;
const discount = ref(1000);
const total = subtotal - discount.value;

watch(bookingDate,() => {
  bookingInfo.value.checkInDate = bookingDate.value.start
  bookingInfo.value.checkOutDate = bookingDate.value.end
  checkInDate.value = bookingDate.value.start
  checkOutDate.value = bookingDate.value.end
})

const goBack = () => {
  router.back();
};
// const isLoading = ref(false);

const userInfo = ref(null);
const city = ref("臺北市");
const zipcodeList = ref([]);
const countyList = (city) => ZipCodeMap.filter((value) => value.name == city);

watch(
  city,
  () => {
    const list = countyList(city.value);
    zipcodeList.value = list[0].districts;
  },
  { immediate: true }
);

const getUserAdderss = () => {
  if (!loginUser.value) return;
  const getCity = (zipcode) =>
    ZipCodeMap.find((value) => {
      return value.districts.find((item) => item.zip == zipcode);
    });
  const cityObj = getCity(loginUser?.value.address.zipcode);
  const form = {
    name: loginUser?.value.name,
    email: loginUser?.value.email,
    phone: loginUser?.value.phone,
    city: cityObj.name,
    zipcode: loginUser?.value.address.zipcode,
    address: loginUser?.value.address.detail,
  };
  userInfo.value.setValues(form);
};

const confirmBooking = () => {
  const userData = {
    name: userInfo.value.values.name,
    email: userInfo.value.values.email,
    phone: userInfo.value.values.phone,
    address: {
      zipcode: userInfo.value.values.zipcode,
      detail: userInfo.value.values.address,
    },
  };

  bookingInfo.value.userInfo = userData;
  delete bookingInfo.value.daysCount;

  createOrder(bookingInfo.value);
};
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon class="fs-5 text-neutral-100" icon="mdi:keyboard-arrow-left" />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div :class="{ 'd-none': isRoomIdEdit }">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div>
                      <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                      <p class="mb-0 fw-medium">
                        {{ roomSelected?.name || ''}}
                      </p>
                    </div>
                    <button
                      class="bg-transparent border-0 fw-bold text-decoration-underline"
                      type="button"
                      @click="isRoomIdEdit = !isRoomIdEdit"
                    >
                      編輯
                    </button>
                  </div>
                </div>

                <div :class="{ 'd-none': !isRoomIdEdit }">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                  <div>
                    <label for="roomId" class="form-label">選擇房型</label>
                    <select
                      v-model="bookingInfo.roomId"
                      id="roomId"
                      class="form-select"
                      aria-label="select roomId"
                    >
                      <option v-for="room in roomsData" :value="room._id">{{ room.name  }}</option>
                    </select>
                  </div>
                  <button
                    class="btn btn btn-primary-100 text-neutral-0 border-0 fw-bold"
                    type="button"
                    @click="isRoomIdEdit = !isRoomIdEdit"
                  >
                    確定
                  </button>
                  </div>
                </div>

                <div :class="{ 'd-none': isDateIdEdit }">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div>
                      <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                      <p class="mb-2 fw-medium">入住：{{ checkInFormat }}</p>
                      <p class="mb-0 fw-medium">退房：{{ checkOutFormat }}</p>
                    </div>
                    <button
                      class="bg-transparent border-0 fw-bold text-decoration-underline"
                      type="button"
                      @click="isDateIdEdit = !isDateIdEdit"
                    >
                      編輯
                    </button>
                  </div>
                </div>

                <div :class="{ 'd-none': !isDateIdEdit }">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                  <div>
                    <ClientOnly>
                      <DatePicker
                        v-model.range.string="bookingDate"
                        :masks="masks"
                        :first-day-of-week="1"
                        :min-date="minDate"
                        :max-date="maxDate"
                        :rows="rows"
                        :columns="columns"
                        :expanded="expanded"
                        :title-position="titlePosition"
                      />
                    </ClientOnly>
                  </div>

                  <button
                    class="btn btn btn-primary-100 text-neutral-0 border-0 fw-bold"
                    type="button"
                    @click="isDateIdEdit = !isDateIdEdit"
                  >
                    確定
                  </button>
                  </div>
                </div>

                <div :class="{ 'd-none': isBookingPeopleIdEdit }">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <div>
                      <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                      <p class="mb-0 fw-medium">{{ bookingInfo.peopleNum }} 人</p>
                    </div>
                    <button
                      class="bg-transparent border-0 fw-bold text-decoration-underline"
                      type="button"
                      @click="isBookingPeopleIdEdit = !isBookingPeopleIdEdit"
                    >
                      編輯
                    </button>
                  </div>
                </div>

                <div :class="{ 'd-none': !isBookingPeopleIdEdit }">
                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                  <div>
                    <label for="peopleNum" class="form-label">人數</label>
                    <select
                      v-model="bookingInfo.peopleNum"
                      id="peopleNum"
                      class="form-select"
                      aria-label="select peopleNum"
                    >
                      <option v-for="num in maxPeople" :value="num">{{ num  }} 人</option>
                    </select>
                  </div>
                  <button
                    class="btn btn btn-primary-100 text-neutral-0 border-0 fw-bold"
                    type="button"
                    @click="isBookingPeopleIdEdit = !isBookingPeopleIdEdit"
                  >
                    確定
                  </button>
                </div>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <div
                class="d-flex justify-content-between align-items-center mb-10"
              >
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click.prevent="getUserAdderss()"
                >
                  套用會員資料
                </button>
              </div>
              <VeeForm ref="userInfo" v-slot="{ errors, meta }" @submit="">
                <div class="d-flex flex-column gap-6">
                  <div class="text-neutral-100">
                    <label for="name" class="form-label fs-8 fs-md-7 fw-bold"
                      >姓名</label
                    >
                    <VeeField
                      name="name"
                      id="name"
                      type="text"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['name'] }"
                      placeholder="請輸入姓名"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="name" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="phone" class="form-label fs-8 fs-md-7 fw-bold"
                      >手機號碼</label
                    >
                    <VeeField
                      name="phone"
                      id="phone"
                      type="tel"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['phone'] }"
                      placeholder="請輸入手機號碼"
                      :rules="{ required: true, regex: /^09[0-9]{8}$/ }"
                    />
                    <VeeErrorMessage class="text-danger" name="phone" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="email" class="form-label fs-8 fs-md-7 fw-bold"
                      >電子信箱</label
                    >
                    <VeeField
                      name="email"
                      id="email"
                      type="email"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['email'] }"
                      placeholder="請輸入電子信箱"
                      rules="required|email"
                    />
                    <VeeErrorMessage class="text-danger" name="email" />
                  </div>

                  <div class="text-neutral-100">
                    <label for="address" class="form-label fs-8 fs-md-7 fw-bold"
                      >地址</label
                    >
                    <div className="d-flex gap-2 mb-4">
                      <VeeField
                        v-model="city"
                        name="city"
                        as="select"
                        class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                        :class="{ 'is-invalid': errors['city'] }"
                        rules="required"
                      >
                        <option
                          v-for="item in cityList"
                          :key="item"
                          :value="item"
                          :selected="item == '臺北市'"
                        >
                          {{ item }}
                        </option>
                      </VeeField>
                      <VeeField
                        name="zipcode"
                        as="select"
                        class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                        :class="{ 'is-invalid': errors['zipcode'] }"
                        rules="required"
                      >
                        <option v-for="item in zipcodeList" :value="item.zip">
                          {{ item.name }}
                        </option>
                      </VeeField>
                    </div>
                    <VeeField
                      name="address"
                      id="address"
                      type="text"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors['address'] }"
                      placeholder="請輸入詳細地址"
                      rules="required"
                    />
                  </div>
                </div>
              </VeeForm>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        24 坪
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        1 張大床
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-4 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房間格局
                  </h3>
                  <ul
                    class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="layout in roomData.layoutInfo"
                      :key="layout.title"
                      class="d-flex gap-2"
                    >
                      <Icon
                        v-if="layout.isProvide"
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <Icon
                        v-else
                        class="fs-5 text-danger-100"
                        icon="material-symbols:close"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ layout.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="facility in roomData.facilityInfo"
                      :key="facility.title"
                      class="d-flex gap-2"
                    >
                      <Icon
                        v-if="facility.isProvide"
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <Icon
                        v-else
                        class="fs-5 text-danger-100"
                        icon="material-symbols:close"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ facility.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      v-for="amenity in roomData.amenityInfo"
                      :key="amenity.title"
                      class="d-flex gap-2"
                    >
                      <Icon
                        v-if="amenity.isProvide"
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <Icon
                        v-else
                        class="fs-5 text-danger-100"
                        icon="material-symbols:close"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ amenity.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="roomData.imageUrl"
                :alt="`${roomData.name}-main`"
              />

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div
                    class="d-flex align-items-center text-neutral-100 fw-medium"
                  >
                    <span>NT$ {{ roomData.price }}</span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80"> {{ daysCount }} 晚</span>
                  </div>
                  <span class="fw-medium"> NT$ {{ subtotal }} </span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-medium"
                >
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ {{ discount.toLocaleString() }}
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40" />
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                >
                  <p class="d-flex align-items-center mb-0">總價</p>
                  <span> NT$ {{ total.toLocaleString() }} </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
  </main>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
