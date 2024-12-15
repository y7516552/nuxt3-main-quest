<script setup>
const apiUrl = process.env.VITE_PUBLIC_API_URL;
import { ZipCodeMap, cityList } from "~/utils/zipcodes";
const { signup } = useLogingStore();

const isEmailExists = ref(false);

const verifyEmail = async (email) => {
  try {
    // https://vue-lessons-api.vercel.app
    const res = await $fetch("/verify/email", {
      baseURL: apiUrl,
      method: "POST",
      body: { email: email },
    });
    isEmailExists.value = res.result.isEmailExists;
  } catch (error) {
    error_message.value = error.response._data.message;
  }
};

const isEmailAndPasswordValid = ref(false);

const isAlphanumeric = (string = "") => {
  return string.match(/(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z)]/)
    ? true
    : "至少 8 個字元，至少一個英文(大寫或小寫) + 一個數字";
};
const userData = {
  email: "",
  password: "",
  name: "",
  phone: "",
  birthday: "",
  address: {
    zipcode: 0,
    detail: "",
  },
};
const nextPage = (value) => {
  isEmailAndPasswordValid.value = true;
  userData.email = value.email;
  userData.password = value.password;
};

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

const agreementCheck = ref(false);

const register = (value) => {
  userData.name = value.name;
  userData.phone = value.phone;
  userData.birthday = value.year + value.month + value.day;
  userData.address.zipcode = value.zipcode;
  userData.address.detail = value.address;
  signup(userData);
};
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VeeForm
        @submit="nextPage"
        v-slot="{ meta }"
        :class="{ 'd-none': isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="email">
            電子信箱
          </label>
          <VeeField
            name="email"
            id="email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            placeholder="hello@exsample.com"
            type="email"
            rules="required|email"
            @update:model-value="verifyEmail"
          />
          <p class="text-light" :class="isEmailExists ? '' : 'd-none'">
            此Email已註冊
          </p>
          <VeeErrorMessage class="text-light" name="email" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password">
            密碼
          </label>
          <VeeField
            name="password"
            id="password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            placeholder="請輸入密碼"
            type="password"
            :rules="isAlphanumeric"
          />
          <VeeErrorMessage class="text-light" name="password" />
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword">
            確認密碼
          </label>
          <VeeField
            name="confirmPassword"
            id="confirmPassword"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            placeholder="請再輸入一次密碼"
            type="password"
            rules="required|confirmed:@password"
          />
          <VeeErrorMessage class="text-light" name="confirmPassword" />
        </div>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="submint"
          :disabled="!meta.valid || isEmailExists"
        >
          下一步
        </button>
      </VeeForm>
      <VeeForm
        ref="userData2"
        v-slot="{ meta }"
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        class="mb-4"
        @submit="register"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
          <VeeField
            name="name"
            id="name"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            placeholder="請輸入姓名"
            type="text"
            rules="required"
          />
          <VeeErrorMessage class="text-light" name="name" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="phone">
            手機號碼
          </label>
          <VeeField
            name="phone"
            id="phone"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            placeholder="請輸入手機號碼"
            type="tel"
            :rules="{ required: true, regex: /^09[0-9]{8}$/ }"
          />
          <VeeErrorMessage class="text-light" name="phone" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
          <div class="d-flex gap-2">
            <VeeField
              name="year"
              as="select"
              id="birth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              rules="required"
            >
              <option v-for="year in 65" :key="year" :value="`${year + 1958}/`">
                {{ year + 1958 }} 年
              </option>
            </VeeField>
            <VeeField
              name="month"
              as="select"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              rules="required"
            >
              <option v-for="month in 12" :key="month" :value="`${month}/`">
                {{ month }} 月
              </option>
            </VeeField>
            <VeeField
              name="day"
              as="select"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              rules="required"
            >
              <option v-for="day in 30" :key="day" :value="`${day}/`">
                {{ day }} 日
              </option>
            </VeeField>
          </div>
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="form-label text-neutral-0 fw-bold" for="address">
            地址
          </label>
          <div>
            <div class="d-flex gap-2 mb-2">
              <VeeField
                v-model="city"
                name="city"
                as="select"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
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
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
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
              class="form-control p-4 rounded-3"
              placeholder="請輸入詳細地址"
              rules="required"
            />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <VeeField
            v-slot="{ field }"
            name="agreementCheck"
            type="checkbox"
            :value="true"
            :unchecked-value="false"
          >
            <input
              type="checkbox"
              name="agreementCheck"
              class="form-check-input"
              v-model="agreementCheck"
            />
            <label class="form-check-label fw-bold" for="agreementCheck">
              我已閱讀並同意本網站個資使用規範
            </label>
          </VeeField>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
          :disabled="!meta.valid || !agreementCheck"
        >
          完成註冊
        </button>
      </VeeForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="/login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
  </div>
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

input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
