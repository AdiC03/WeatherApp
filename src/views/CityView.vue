<template>
    <div>
        <!-- Need suspense to render in async -->
        <!-- Dafuq is template and #fallback? -->
      <Suspense>
        <AsyncCityView />
        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
  </template>

<script setup>
import AsyncCityView from '@/components/AsyncCityView.vue';


</script>