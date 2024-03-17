<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <SiteNav />
    <RouterView />
  </div> 
</template>

<script setup>
  import SiteNav from "./components/SiteNav.vue";
  import { RouterView } from 'vue-router';
</script>

<style lang="scss" scoped>

</style>