<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="ServiceCatalog">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  font-size: 10px;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f5f5f5;
  color: #333;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}
</style>