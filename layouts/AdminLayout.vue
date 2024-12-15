<script setup>
const loginStore = useLogingStore();
const { loginUser , isAdmin } = storeToRefs(loginStore);
if (!loginUser.value.name) loginStore.getUser();
if(!isAdmin) navigateTo("/")
const initialName = computed(() => loginUser?.value?.name?.split("")[0]);

const navItems = ref([
  {
    icon: "mdi-newspaper",
    title: "最新消息",
    to: "/admin/news",
  },
  {
    icon: "mdi-bed",
    title: "房型管理",
    to: "/admin/rooms",
  },
  {
    icon: "mdi-food-fork-drink",
    title: "佳餚管理",
    to: "/admin/culinary",
  },
  {
    icon: "mdi-order-bool-descending",
    title: "訂單管理",
    to: "/admin/orders",
  },
  {
    icon: "mdi-home",
    title: "前台首頁",
    to: "/",
  },
]);
const overlay = ref(true);
</script>
<template>
  <div>
    <ClientOnly>
      <v-app>
        <v-navigation-drawer app expand-on-hover rail color="#140f0a">
          <v-list>
            <v-list-item :subtitle="loginUser.email" :title="loginUser.name">
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-1">
                  <span class="text-h5">{{ initialName }}</span>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <NuxtLink
              v-for="item in navItems"
              :key="item.title"
              :to="item.to"
              class="text-white list-items"
            >
              <v-list-item
                :title="item.title"
                color="#fff"
              >
                <template v-slot:prepend>
                  <v-icon class="opacity-100 text-white" :icon="item.icon" ></v-icon>
                </template>
              </v-list-item>
            </NuxtLink>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="#140f0a">
          <!-- -->
          <v-app-bar-title class="text-h5 font-weight-bold"
            >享樂酒店</v-app-bar-title
          >
        </v-app-bar>

        <v-main>
          <v-container fluid>
            <slot />
          </v-container>
        </v-main>

        <v-footer app>
          <!-- -->
        </v-footer>
      </v-app>
    </ClientOnly>
  </div>
</template>
<style scoped>
.list-items {
  text-decoration: none;
}
</style>
