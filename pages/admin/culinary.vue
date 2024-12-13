<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
const {
  isLoading,
  culinaryList,
  getCulinaryList,
  createCulinary,
  updateCulinary,
  deleteCulinary,
} = useCulinary();
getCulinaryList();

const dialog = ref(false);
const form = ref(null);
const tempCulinary = ref({});
const submintBtn = ref(null);
const dialogTitle = ref("");
const weekdayList = ref(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]);
const timeList = ref();
const accuracy = ref(30)

const range = ref({
  start: new Date("2024/12/13 15:30").getTime(),
  end: new Date("2024/12/13 19:30").getTime(),
});
const diningTimeString = (time) => {
  const start = new Date(time.start).toLocaleTimeString('en-GB')
  const end = new Date(time.end).toLocaleTimeString('en-GB')
  const string = start.slice(0, 5)+'-'+end.slice(0, 5)
  return string
} 


const delelteDialog = ref(false);

const openDialog = async (culinary = {}, type = "update") => {
  tempCulinary.value = culinary;
  if (type === "delete") {
    delelteDialog.value = true;
  } else {
    dialog.value = true;
    dialogTitle.value = "新增";
    if (culinary._id) {
      dialogTitle.value = "修改";
      const weekRange = culinary.diningTime.split(" ")[0]
      const timeRange = culinary.diningTime.split(" ")[1]
      range.value = {
        start:new Date(`2024/12/13 ${timeRange.split('-')[0]}`).getTime(),
        end:new Date(`2024/12/13 ${timeRange.split('-')[1]}`).getTime(),
      }

      const data = {
        id: culinary._id,
        title: culinary.title,
        description: culinary.description,
        image: culinary.image,
        diningTime: culinary.diningTime,
        weekStart: weekRange.split("-")[0],
        weekEnd:weekRange.split("-")[1],
        time:diningTimeString(range.value)
      };

      await nextTick(() => {
        form.value.setValues(data);
      });
    }
  }
};


// watch(range,() => {
//   if(form.value) {
//     const weekString = form.value.values.weekStart+'-'+form.value.values.weekEnd
//     form.value.setFieldValue('time',diningTimeString(range.value));
//     form.value.setFieldValue('diningTime',`${weekString} ${diningTimeString(range.value)}`);
//   }
// },
// { immediate: true }
// )

// watch(form,() => {
//   if(form.value) {
//     const weekString = form.value.values.weekStart+'-'+form.value.values.weekEnd
//     form.value.setFieldValue('time',diningTimeString(range.value));
//     form.value.setFieldValue('diningTime',`${weekString} ${diningTimeString(range.value)}`);
//   }
// },
// { immediate: true, deep: true }
// )

const submit = (data) => {
  dialog.value = false;
  const weekString = data.weekStart+'-'+data.weekEnd
  data.diningTime =`${weekString} ${diningTimeString(range.value)}`
  delete data.weekStart
  delete data.weekEnd
  if (!data.id) createCulinary(data);
  if (data.id) {
    delete data.id;
    updateCulinary(tempCulinary.value._id, data);
  }
  tempCulinary.value = {};
};

const submitDelete = (id) => {
  delelteDialog.value = false;
  deleteCulinary(id);
};
</script>
<template>
  <div>
    <div class="mb-4">
      <h2>美味佳餚列表</h2>
    </div>
    <v-row>
      <v-col cols="12" class="d-flex">
        <button type="button" class="btn btn-primary-100" @click="openDialog">
          新增
        </button>
      </v-col>
      <v-col v-for="culinary in culinaryList" sm="12" md="4" lg="3">
        <v-card>
          <v-img
            class="mx-auto"
            height="300"
            :lazy-src="culinary.image"
            max-width="500"
            :src="culinary.image"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
          <v-card-item>
            <v-card-title class="font-weight-bold">{{
              culinary.title
            }}</v-card-title>
          </v-card-item>
          <v-card-text>
            {{ culinary.description }}
          </v-card-text>
          <v-card-text>
            {{ culinary.diningTime }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click.prevent="openDialog(culinary)" elevation="12">
              查看內容
            </v-btn>
            <v-btn
              color="red"
              variant="flat"
              @click.prevent="openDialog(culinary, 'delete')"
              elevation="12"
            >
              刪除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="auto" persistent>
      <v-card min-width="600">
        <v-toolbar>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn icon="mdi-close" @click="dialog = !dialog"></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <VeeForm
              ref="form"
              @submit="submit"
              v-slot="{ meta, values }"
              class="w-100 mb-4"
            >
              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 text-dark fw-bold" for="title"> 標題 </label>
                <VeeField
                  name="title"
                  id="title"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  type="text"
                  rules="required"
                />

                <VeeErrorMessage class="text-danger" name="title" />
              </div>

              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 text-dark fw-bold" for="description">
                  描述
                </label>
                <VeeField
                  as="textarea"
                  name="description"
                  id="description"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  type="text"
                  rules="required"
                />

                <VeeErrorMessage class="text-danger" name="description" />
              </div>

              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 text-dark fw-bold" for="image"> 圖片 </label>
                <VeeField
                  name="image"
                  id="image"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  type="text"
                  rules="required"
                />
                <VeeErrorMessage class="text-danger" name="image" />
              </div>
              <div v-if="values.image" class="mb-4 fs-8 fs-md-7">
                <v-img
                  class="mx-auto"
                  height="300"
                  max-width="500"
                  :src="values.image"
                ></v-img>
              </div>
              <div class="mb-4 fs-8 fs-md-7">
                <label class="mb-2 text-dark fw-bold" for="image"> 供餐時間 </label>
                <div class="d-flex">

                  <VeeField
                    name="weekStart"
                    as="select"
                    id="weekStart"
                    class="form-control p-2 text-neutral-100 fw-medium border-neutral-40 me-1"
                    rules="required"
                  > 
                    <option v-for="item in weekdayList" :key="item" :value="item">{{ item }}</option>
                  </VeeField>
                  <VeeField
                    name="weekEnd"
                    as="select"
                    id="weekEnd"
                    class="form-control p-2 text-neutral-100 fw-medium border-neutral-40 me-1"
                    rules="required"
                  >
                    <option v-for="item in weekdayList" :key="item" :value="item">{{ item }}</option>
                  </VeeField>
                  <DatePicker
                    name="time"
                    mask="HH:mm"
                    v-model.range="range"
                    hide-time-header
                    mode="time"
                    :minute-accuracy="accuracy"
                    is24hr
                  />
                </div>
                
              </div>

              <button
                ref="submintBtn"
                type="submit"
                class="d-none"
                :disabled="!meta.valid"
              ></button>
            </VeeForm>
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
        :text="`確定要刪除${tempCulinary.title}嗎?`"
        title="刪除?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="delelteDialog = !delelteDialog"> 取消 </v-btn>

          <v-btn @click="submitDelete(tempCulinary._id)"> 刪除 </v-btn>
        </template>
      </v-card>
    </v-dialog>

    <!-- <v-overlay v-model="isLoading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay> -->
  </div>
</template>
<style scoped></style>
