<script setup>
const {
  isLoading,
  newsList,
  getNewsList,
  createNews,
  updateNews,
  deleteNews,
} = useNews();
getNewsList();

const dialog = ref(false);
const form = ref(null);
const tempNews = ref({});
const submintBtn = ref(null);
const dialogTitle =ref("")

const delelteDialog =ref(false)

const openDialog = async (news = {},type='update') => {
    tempNews.value = news
  if(type==='delete'){
    delelteDialog.value = true

  }else{
      dialog.value = true;
      dialogTitle.value="新增"
      if (news._id) {
        dialogTitle.value="修改"
        const data = {
          id: news._id,
          title: news.title,
          description: news.description,
          image: news.image,
        };
    
        await nextTick(() => {
            form.value.setValues(data);
        });
      }
  }
};

const submit = (data) => {
  dialog.value = false;
  if (!data.id) createNews(data);
  if (data.id) {
    delete data.id
    updateNews(tempNews.value._id,data);
  }
  tempNews.value = {}
};

const submitDelete = (id) =>{
    delelteDialog.value = false
    deleteNews(id)
}

</script>
<template>
  <div>
    <div class="mb-4">
      <h2 class="font-weight-bold">最新消息</h2>
    </div>
    <v-row>
      <v-col cols="12" class="d-flex">
        <button type="button" class="btn btn-primary-100 text-white" @click="openDialog">
          新增
        </button>
      </v-col>
      <template v-if="newsList.length ==0" >
        <v-col cols="12" >
          目前沒有任何最新消息....
        </v-col>
      </template>
      
      <template v-else>
        <v-col v-for="news in newsList" sm="12" md="4" lg="3">
          <v-card>
            <v-img
              class="mx-auto"
              height="300"
              :lazy-src="news.image"
              max-width="500"
              :src="news.image"
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
              <v-card-title class="font-weight-bold">{{ news.title }}</v-card-title>
            </v-card-item>
            <v-card-text>
              {{ news.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click.prevent="openDialog(news)" elevation="12">
                查看內容
              </v-btn>
              <v-btn color="red" variant="flat" @click.prevent="openDialog(news,'delete')" elevation="12">
                刪除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <v-dialog v-model="dialog" width="auto" persistent>
      <v-card min-width="600">
        <v-toolbar>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn
            icon="mdi-close"
            @click="dialog = !dialog"
          ></v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <VeeForm
              ref="form"
              @submit="submit"
              v-slot="{ meta , values }"
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
              <div v-if="values.image"  class="mb-4 fs-8 fs-md-7">
                <v-img
                  class="mx-auto"
                  height="300"
                  max-width="500"
                  :src="values.image"
                ></v-img>
              </div>

              <button ref="submintBtn" type="submit" class="d-none" :disabled="!meta.valid"></button>
            </VeeForm>
          </v-row>
        </v-card-text>

        <template v-slot:actions>
          <v-btn elevation="12" text="取消" @click="dialog = !dialog"></v-btn>
          <v-btn elevation="12" :text="dialogTitle" @click="submintBtn.click()"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="delelteDialog"
      max-width="400"
      persistent
    >

      <v-card
        prepend-icon="mdi-delete-alert"
        :text="`確定要刪除${tempNews.title}嗎?`"
        title="刪除?"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="delelteDialog = !delelteDialog">
            取消
          </v-btn>

          <v-btn @click="submitDelete(tempNews._id)">
            刪除
          </v-btn>
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
