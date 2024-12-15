<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { useScreens } from "vue-screen-utils";
import { ZipCodeMap, cityList } from "~/utils/zipcodes";
const { isLoading, orderList, getOrderList, updateOrder, deleteOrder } =
  useOrders();
getOrderList();
const { roomsList, getRoomsList } = useRooms();
getRoomsList();

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
  start: startDate,
  end: endDate,
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

const formatDate = (date) => {
  const offsetToUTC8 = new Date(date).getHours() + 8;
  new Date(date).setHours(offsetToUTC8);
  return new Date(date).toISOString().split("T")[0];
};

const countDateDiffs = ({ start, end }) => {
  var startDate = new Date(start);
  var endDate = new Date(end);
  return parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24);
  w;
};

const bookingDays = (start, end) => {
  return countDateDiffs({ start, end });
};

const roomPrice = (price) => {
  return price.toLocaleString();
};
const tab = ref(0);
const dialog = ref(false);
const form = ref(null);

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

const roomId = ref(null);

const tempOrder = ref({});
const submintBtn = ref(null);
const dialogTitle = ref("");

const delelteDialog = ref(false);

const openDialog = async (order = {}, type = "update") => {
  try {
    bookingDate.value = { start: order.checkInDate, end: order.checkOutDate };
    tempOrder.value = order;
    if (type === "delete") {
      delelteDialog.value = true;
    } else {
      dialog.value = true;
      dialogTitle.value = "修改";

      const getCity = (zipcode) => {
        return ZipCodeMap.find((value) =>
          value.districts.find((item) => item.zip == zipcode)
        );
      };
      const cityObj = getCity(order.userInfo.address.zipcode);

      const data = {
        id: order._id,
        roomId: order.roomId,
        checkInDate: formatDate(order.checkInDate),
        checkOutDate: formatDate(order.checkOutDate),
        peopleNum: order.peopleNum,
        userInfo: {
          name: order.userInfo.name,
          email: order.userInfo.email,
          phone: order.userInfo.phone,
          city: cityObj.name,
          zipcode: order.userInfo.address.zipcode,
          address: order.userInfo.address.detail,
        },
      };

      await nextTick(() => {
        form.value.setValues(data);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
watch(bookingDate, () => {
  if (form.value) {
    form.value.setFieldValue("checkInDate", bookingDate.value.start);
    form.value.setFieldValue("checkOutDate", bookingDate.value.end);
  }
});

const submit = (data) => {
  dialog.value = false;
  delete data.id;
  data.roomId = data.roomId._id;
  data.userInfo.address = {
    zipcode: data.userInfo.zipcode,
    detail: data.userInfo.address,
  };
  delete data.userInfo.city;
  delete data.userInfo.zipcode;
  updateOrder(tempOrder.value._id, data);
  tempOrder.value = {};
};

const submitDelete = (id) => {
  delelteDialog.value = false;
  deleteOrder(id);
};
</script>
<template>
  <div>
    <div class="mb-4">
      <h2 class="font-weight-bold">訂單</h2>
    </div>
    <v-card>
      <v-toolbar class="bg-primary-100">
        <v-toolbar-title class="font-weight-bold text-white"
          >訂單列表</v-toolbar-title
        >

        <v-spacer></v-spacer>

        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            align-tabs="left"
            class="bg-primary-100"
            stacked
          >
            <v-tab
              v-for="item in orderList"
              :key="item.title"
              :value="'tab-' + item.title"
            >
              <!-- <v-icon icon="mdi-phone"></v-icon> -->
              <p class="font-weight-bold text-white">
                {{ item.title }}({{ item.data.length }})
              </p>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          v-for="item in orderList"
          :key="item.title"
          :value="'tab-' + item.title"
        >
          <v-card>
            <v-row>
              <template v-if="item.data == 0">
                <v-col cols="12"> 目前沒有訂單.... </v-col>
              </template>
              <template v-else>
                <v-col v-for="order in item.data" sm="12" md="4" lg="3">
                  <v-card>
                    <v-img
                      class="mx-auto"
                      height="300"
                      :lazy-src="order.roomId.imageUrl"
                      max-width="500"
                      :src="order.roomId.imageUrl"
                    >
                      <template v-slot:placeholder>
                        <div
                          class="d-flex align-center justify-center fill-height"
                        >
                          <v-progress-circular
                            color="grey-lighten-4"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
  
                    <v-card-item>
                      <v-card-title class="font-weight-bold">
                        {{ order.roomId.name }} ，
                        {{ bookingDays(order.checkInDate, order.checkOutDate) }}晚
                      </v-card-title>
                    </v-card-item>
                    <hr />
                    <v-card-text> 訂單編號:{{ order._id }} </v-card-text>
                    <v-card-text>
                      入住：{{ $dateFormat(order.checkInDate) }}
                    </v-card-text>
                    <v-card-text>
                      退房：{{ $dateFormat(order.checkOutDate) }}
                    </v-card-text>
                    <v-card-text> 住宿人數：{{ order.peopleNum }}位 </v-card-text>
                    <v-card-actions>
                      <v-btn @click.prevent="openDialog(order)" elevation="12">
                        查看內容
                      </v-btn>
                      <v-btn
                        color="red"
                        variant="flat"
                        @click.prevent="openDialog(order, 'delete')"
                        elevation="12"
                      >
                        刪除
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>

    <v-dialog v-model="dialog" width="auto" persistent>
      <v-card min-width="600">
        <v-toolbar>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
          <p v-if="tempOrder._id">
            {{ tempOrder._id }}
          </p>
          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn icon="mdi-close" @click="dialog = !dialog"></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <VeeForm
                ref="form"
                @submit="submit"
                v-slot="{ errors, meta, values }"
                class="w-100 mb-4"
              >
                <div class="mb-4 fs-8 fs-md-7">
                  <label class="mb-2 text-dark fw-bold" for="roomId">
                    房型
                  </label>
                  <VeeField
                    name="roomId"
                    id="roomId"
                    as="select"
                    class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                    rules="required"
                  >
                    <option
                      v-for="room in roomsList"
                      :key="room._id"
                      :value="room"
                    >
                      {{ room.name }}
                    </option>
                  </VeeField>

                  <VeeErrorMessage class="text-danger" name="roomId" />
                </div>
                <div class="mb-4 fs-8 fs-md-7">
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
                <div>
                  <div class="d-flex flex-wrap gap-2 mb-4">
                    <div class="form-floating flex-grow-1 flex-shrink-1">
                      <input
                        id="checkinInput"
                        readonly
                        type="date"
                        :value="values.checkInDate"
                        class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                        style="min-height: 74px"
                        placeholder="yyyy-mm-dd"
                      />
                      <label
                        class="text-neutral-80 fw-medium"
                        style="top: 8px; left: 8px"
                        for="checkinInput"
                        >入住
                      </label>
                    </div>

                    <div class="form-floating flex-grow-1 flex-shrink-1">
                      <input
                        id="checkoutInput"
                        readonly
                        type="date"
                        :value="values.checkOutDate"
                        class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                        style="min-height: 74px"
                        placeholder="yyyy-mm-dd"
                      />
                      <label
                        class="text-neutral-80 fw-medium"
                        style="top: 8px; left: 8px"
                        for="checkoutInput"
                        >退房
                      </label>
                    </div>
                  </div>
                </div>
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <div class="mb-4 fs-8 fs-md-7">
                  <label class="mb-2 text-dark fw-bold" for="peopleNum">
                    人數
                  </label>
                  <VeeField
                    name="peopleNum"
                    id="peopleNum"
                    class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                    type="text"
                    rules="required"
                  />

                  <VeeErrorMessage class="text-danger" name="peopleNum" />
                </div>

                <div class="mb-4 fs-8 fs-md-7">
                  <label class="mb-2 text-dark fw-bold" for="userInfo.name">
                    姓名
                  </label>
                  <VeeField
                    name="userInfo.name"
                    id="userInfo.name"
                    class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                    type="text"
                    rules="required"
                  />

                  <VeeErrorMessage class="text-danger" name="userInfo.name" />
                </div>
                <div class="mb-4 fs-8 fs-md-7">
                  <label class="mb-2 text-dark fw-bold" for="userInfo.phone">
                    手機號碼
                  </label>
                  <VeeField
                    name="userInfo.phone"
                    id="userInfo.phone"
                    type="tel"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['phone'] }"
                    placeholder="請輸入手機號碼"
                    :rules="{ required: true, regex: /^09[0-9]{8}$/ }"
                  />
                  <VeeErrorMessage class="text-danger" name="userInfo.phone" />
                </div>

                <div class="mb-4 fs-8 fs-md-7">
                  <label class="mb-2 text-dark fw-bold" for="userInfo.email">
                    電子信箱
                  </label>
                  <VeeField
                    name="userInfo.email"
                    id="userInfo.email"
                    type="email"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['userInfo.email'] }"
                    placeholder="請輸入電子信箱"
                    rules="required|email"
                  />
                  <VeeErrorMessage class="text-danger" name="userInfo.email" />
                </div>

                <div class="mb-4 fs-8 fs-md-7">
                  <label class="mb-2 text-dark fw-bold" for="userInfo.address">
                    地址
                  </label>
                  <div className="d-flex gap-2 mb-4">
                    <VeeField
                      v-model="city"
                      name="userInfo.city"
                      as="select"
                      class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      :class="{ 'is-invalid': errors['userInfo.city'] }"
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
                      name="userInfo.zipcode"
                      id="userInfo.zipcode"
                      as="select"
                      class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      :class="{ 'is-invalid': errors['userInfo.zipcode'] }"
                      rules="required"
                    >
                      <option v-for="item in zipcodeList" :value="item.zip">
                        {{ item.name }}
                      </option>
                    </VeeField>
                  </div>
                  <VeeField
                    name="userInfo.address"
                    id="userInfo.address"
                    type="text"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['userInfo.address'] }"
                    placeholder="請輸入詳細地址"
                    rules="required"
                  />
                </div>

                <button
                  ref="submintBtn"
                  type="submit"
                  class="d-none"
                  :disabled="!meta.valid"
                ></button>
              </VeeForm>
            </v-col>
            <v-col cols="12"> </v-col>
          </v-row>
        </v-card-text>

        <template v-slot:actions>
          <v-btn elevation="12" text="取消" @click="dialog = !dialog"></v-btn>
          <v-btn
            elevation="12"
            :text="dialogTitle"
            @click="submintBtn.click()"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delelteDialog" max-width="400" persistent>
      <v-card
        prepend-icon="mdi-delete-alert"
        :text="`確定要刪除 訂單: ${tempOrder._id}嗎?`"
        title="刪除?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="delelteDialog = !delelteDialog"> 取消 </v-btn>

          <v-btn @click="submitDelete(tempOrder._id)"> 刪除 </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
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
</style>
