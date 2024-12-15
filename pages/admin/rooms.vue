<script setup>
const {
  isLoading,
  roomsList,
  getRoomsList,
  createRoom,
  updateRoom,
  deleteRoom,
} = useRooms();
getRoomsList();

const dialog = ref(false);
const form = ref(null);
const tempRoom = ref({});
const submintBtn = ref(null);
const dialogTitle = ref("");
const layoutItem = ref("");
const addLayout = ref(false);
const facilityItem = ref("");
const addFacility = ref(false);
const amenityItem = ref("");
const addAmenity = ref(false);

const delelteDialog = ref(false);

const openDialog = async (room = {}, type = "update") => {
  tempRoom.value = room;
  if (type === "delete") {
    delelteDialog.value = true;
  } else {
    dialog.value = true;
    dialogTitle.value = "新增";
    if (room._id) {
      dialogTitle.value = "修改";
      const data = {
        id: room._id,
        name: room.name,
        description: room.description,
        imageUrl: room.imageUrl,
        imageUrlList: room.imageUrlList,
        areaInfo: room.areaInfo,
        layoutInfo: room.layoutInfo,
        facilityInfo: room.facilityInfo,
        amenityInfo: room.amenityInfo,
        bedInfo: room.bedInfo,
        maxPeople: room.maxPeople,
        price: room.price,
      };

      await nextTick(() => {
        form.value.setValues(data);
      });
    }
  }
};
const submit = (data) => {
  dialog.value = false;
  console.log(data);
  if (!data.id) createRoom(data);
  if (data.id) {
    delete data.id;
    updateRoom(tempRoom.value._id, data);
  }
  tempRoom.value = {};
};

const submitDelete = (id) => {
  delelteDialog.value = false;
  deleteRoom(id);
};
</script>
<template>
  <div>
    <div class="mb-4">
      <h2 class="font-weight-bold">房型</h2>
    </div>
    <v-row>
      <v-col cols="12" class="d-flex">
        <button type="button" class="btn btn-primary-100 text-white" @click="openDialog">
          新增
        </button>
      </v-col>
      <v-col v-for="room in roomsList" sm="12" md="6" lg="4">
        <v-card>
          <v-img
            class="mx-auto"
            height="300"
            :lazy-src="room.imageUrl"
            max-width="500"
            :src="room.imageUrl"
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
              room.name
            }}</v-card-title>
          </v-card-item>
          <v-card-item>
            <div class="my-4 text-subtitle-1">
              $ {{ room.price.toLocaleString() }}
            </div>
          </v-card-item>

          <v-card-text>
            {{ room.description }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click.prevent="openDialog(room)" elevation="12">
              查看內容
            </v-btn>
            <v-btn
              color="red"
              variant="flat"
              @click.prevent="openDialog(room, 'delete')"
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
              <v-row>
                <v-col cols="4">
                  <div class="mb-4 fs-8 fs-md-7">
                    <label class="mb-2 text-dark fw-bold" for="name">
                      標題
                    </label>
                    <VeeField
                      name="name"
                      id="name"
                      class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                      type="text"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="name" />
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="mb-4 fs-8 fs-md-7">
                    <label class="mb-2 text-dark fw-bold" for="price">
                      價錢
                    </label>
                    <VeeField
                      name="price"
                      id="price"
                      class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                      type="text"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="price" />
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="mb-4 fs-8 fs-md-7">
                    <label class="mb-2 text-dark fw-bold" for="maxPeople">
                      最大人數
                    </label>
                    <VeeField
                      name="maxPeople"
                      id="maxPeople"
                      class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                      type="text"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="maxPeople" />
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="mb-4 fs-8 fs-md-7">
                    <label class="mb-2 text-dark fw-bold" for="areaInfo">
                      房間坪數
                    </label>
                    <VeeField
                      name="areaInfo"
                      id="areaInfo"
                      class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                      type="text"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="areaInfo" />
                  </div>
                </v-col>

                <v-col cols="4">
                  <div class="mb-4 fs-8 fs-md-7">
                    <label class="mb-2 text-dark fw-bold" for="bedInfo">
                      床位資訊
                    </label>
                    <VeeField
                      name="bedInfo"
                      id="bedInfo"
                      class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                      type="text"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="bedInfo" />
                  </div>
                </v-col>

                <v-col cols="12">
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
                </v-col>

                <v-col cols="12">
                  <div class="mb-4 fs-8 fs-md-7">
                    <label class="mb-2 text-dark fw-bold" for="imageUrl">
                      主圖片
                    </label>
                    <VeeField
                      name="imageUrl"
                      id="imageUrl"
                      class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                      type="text"
                      rules="required"
                    />
                    <VeeErrorMessage class="text-danger" name="imageUrl" />
                  </div>
                  <div v-if="values.imageUrl" class="mb-4 fs-8 fs-md-7">
                    <v-img
                      class="mx-auto"
                      height="300"
                      max-width="500"
                      :src="values.imageUrl"
                    ></v-img>
                  </div>
                </v-col>

                <v-col cols="12">
                  <VeeFieldArray
                    name="imageUrlList"
                    v-slot="{ fields, push, remove }"
                  >
                    <div class="mb-4 fs-8 fs-md-7">
                      <label class="mb-2 text-dark fw-bold"> 圖片 </label>
                      <VeeErrorMessage
                        class="text-danger"
                        name="imageUrlList"
                      />
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary-100 mb-4"
                      @click="push('')"
                    >
                      新增圖片
                    </button>
                    <v-row v-if="values.imageUrlList">
                      <template v-for="(field, idx) in fields" :key="field.key">
                        <v-col cols="9" class="d-flex align-center">
                          <div
                            class="mb-4 fs-8 fs-md-7 d-flex justify-space-between align-center flex-grow-1"
                          >
                            <label class="text-dark"> 圖片-{{ idx }} </label>
                            <VeeField
                              :name="`imageUrlList[${idx}]`"
                              class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 w-75"
                              type="url"
                              :value="field.value"
                            />
                            <v-btn
                              icon="mdi-close-box"
                              size="x-small"
                              type="button"
                              @click="remove(idx)"
                            >
                            </v-btn>
                          </div>
                        </v-col>
                        <v-col cols="3">
                          <div
                            v-if="values.imageUrlList"
                            class="mb-4 fs-8 fs-md-7"
                          >
                            <v-img
                              class="mx-auto"
                              height="100"
                              max-width="500"
                              :src="field.value"
                            ></v-img>
                          </div>
                        </v-col>
                      </template>
                    </v-row>
                  </VeeFieldArray>
                </v-col>

                <v-col cols="4">
                  <VeeFieldArray
                    name="layoutInfo"
                    v-slot="{ fields, push, remove }"
                  >
                    <div class="mb-4 fs-8 fs-md-7">
                      <label class="mb-2 text-dark fw-bold me-5" for="layoutInfo">
                        格局
                      </label>
                      <button
                        :class="{ 'd-none': addLayout }"
                        type="button"
                        class="btn btn-primary-100"
                        @click="addLayout = !addLayout"
                      >
                        新增格局
                      </button>
                      <div v-show="addLayout" class="mb-4 fs-8 fs-md-7">
                        <label for="newLayout" class="form-label"
                          >格局名稱</label
                        >
                        <input
                          id="newLayout"
                          class="form-control mb-4"
                          type="text"
                          v-model="layoutItem"
                        />
                        <div
                          class="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            type="button"
                            class="btn btn-outline-danger mb-4"
                            @click="
                              addLayout = !addLayout;
                              layoutItem = '';
                            "
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-primary mb-4"
                            @click="
                              push({ title: layoutItem, isProvide: false });
                              addLayout = !addLayout;
                            "
                          >
                            新增
                          </button>
                        </div>
                      </div>
                      <div v-for="(field, idx) in fields" :key="field.key">
                        <VeeField
                          :name="`layoutInfo[${idx}].isProvide`"
                          id="layoutInfo"
                          type="checkbox"
                          :value="field.value.isProvide"
                          :unchecked-value="false"
                        />
                        <span class="mx-5">
                          {{ field.value.title }}
                        </span>
                        <v-btn
                          class="ma-2"
                          color="red-lighten-2"
                          icon="mdi-close-box"
                          variant="text"
                          @click="remove(idx)"
                        ></v-btn>
                      </div>
                      <VeeErrorMessage class="text-danger" name="layoutInfo" />
                    </div>
                  </VeeFieldArray>
                </v-col>

                <v-col cols="4">
                  <VeeFieldArray
                    name="facilityInfo"
                    v-slot="{ fields, push, remove }"
                  >
                    <div class="mb-4 fs-8 fs-md-7">
                      <label
                        class="mb-2 text-dark fw-bold me-5"
                        for="facilityInfo"
                      >
                        設施
                      </label>
                      <button
                        :class="{ 'd-none': addFacility }"
                        type="button"
                        class="btn btn-primary-100"
                        @click="addFacility = !addFacility"
                      >
                        新增設施
                      </button>
                      <div v-show="addFacility" class="mb-4 fs-8 fs-md-7">
                        <label for="newFacility" class="form-label"
                          >設施名稱</label
                        >
                        <input
                          id="newFacility"
                          class="form-control mb-4"
                          type="text"
                          v-model="facilityItem"
                        />
                        <div
                          class="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            type="button"
                            class="btn btn-outline-danger mb-4"
                            @click="
                              addFacility = !addFacility;
                              facilityItem = '';
                            "
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-primary mb-4"
                            @click="
                              push({ title: facilityItem, isProvide: false });
                              addFacility = !addFacility;
                            "
                          >
                            新增
                          </button>
                        </div>
                      </div>
                      <div  v-for="(field, idx) in fields" :key="field.key">
                        <VeeField
                          :name="`facilityInfo[${idx}].isProvide`"
                          id="facilityInfo"
                          type="checkbox"
                          :value="field.value.isProvide"
                          :unchecked-value="false"
                        />
                        <span class="mx-5">
                          {{ field.value.title }}
                        </span>
                        <v-btn
                          class="ma-2"
                          color="red-lighten-2"
                          icon="mdi-close-box"
                          variant="text"
                          @click="remove(idx)"
                        ></v-btn>
                      </div>
                      <VeeErrorMessage class="text-danger" name="layoutInfo" />
                    </div>
                  </VeeFieldArray>
                </v-col>

                <v-col cols="4">
                  <VeeFieldArray
                    name="amenityInfo"
                    v-slot="{ fields, push, remove }"
                  >
                    <div class="mb-4 fs-8 fs-md-7">
                      <label class="mb-2 text-dark fw-bold me-5" for="amenityInfo">
                        備品
                      </label>
                      <button
                        :class="{ 'd-none': addAmenity }"
                        type="button"
                        class="btn btn-primary-100"
                        @click="addAmenity = !addAmenity"
                      >
                        新增備品
                      </button>
                      <div v-show="addAmenity" class="mb-4 fs-8 fs-md-7">
                        <label for="newFacility" class="form-label"
                          >備品名稱</label
                        >
                        <input
                          id="newFacility"
                          class="form-control mb-4"
                          type="text"
                          v-model="amenityItem"
                        />
                        <div
                          class="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            type="button"
                            class="btn btn-outline-danger mb-4"
                            @click="
                              addAmenity = !addAmenity;
                              amenityItem = '';
                            "
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-primary mb-4"
                            @click="
                              push({ title: amenityItem, isProvide: false });
                              addAmenity = !addAmenity;
                            "
                          >
                            新增
                          </button>
                        </div>
                      </div>
                      <div v-for="(field, idx) in fields" :key="field.key">
                        <VeeField
                          :name="`amenityInfo[${idx}].isProvide`"
                          :id="`amenityInfo[${idx}]`"
                          type="checkbox"
                          :value="field.value.isProvide"
                          :unchecked-value="false"
                        />
                        <span class="mx-5">
                          {{ field.value.title }}
                        </span>
                        <v-btn
                          class="ma-2"
                          color="red-lighten-2"
                          icon="mdi-close-box"
                          variant="text"
                          @click="remove(idx)"
                        ></v-btn>
                      </div>
                      <VeeErrorMessage class="text-danger" name="amenityInfo" />
                    </div>
                  </VeeFieldArray>
                </v-col>
              </v-row>
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
          <v-btn elevation="12" text="修改" @click="submintBtn.click()"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delelteDialog" max-width="400" persistent>
      <v-card
        prepend-icon="mdi-delete-alert"
        :text="`確定要刪除${tempRoom.name}嗎?`"
        title="刪除?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="delelteDialog = !delelteDialog"> 取消 </v-btn>

          <v-btn @click="submitDelete(tempRoom._id)"> 刪除 </v-btn>
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
