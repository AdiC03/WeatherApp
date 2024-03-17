<template>
    <header class = "sticky top-0 bg-weather-primary shadow-lg">
        <nav class = "container flex flex-col sm:flex-row 
        items-center gap-4 text-white py-6">

        <RouterLink :to= "{name: 'home'}">
            <div class = "flex items-center gap-3">
                <i class="fa-solid fa-sun text-2xl"></i>
                <p class = "text-2xl"> The Local Weather </p>
            </div>
        </RouterLink>

        <div class="flex gap-3 flex-1 justify-end">
        <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"
          @click = "toggleModal"
        ></i>
        <i
          class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"
          @click = "addCity"
          v-if="route.query.preview"
        ></i>
      </div>

      <Modal
        :modalActive="modalActive"
        @close-modal="toggleModal"
      >
        <div class="text-black">
          <h1 class="text-2xl mb-1">About:</h1>
          <p class="mb-4">
            The Local Weather allows you to track the current and
            future weather of cities of your choosing.
          </p>
          <h2 class="text-2xl">How it works:</h2>
          <ol class="list-decimal list-inside mb-4">
            <li>
              Search for your city by entering the name into the
              search bar.
            </li>
            <li>
              Select a city within the results, this will take
              you to the current weather for your selection.
            </li>
            <li>
              Track the city by clicking on the "+" icon in the
              top right. This will save the city to view at a
              later time on the home page.
            </li>
          </ol>

          <h2 class="text-2xl">Removing a city</h2>
          <p>
            If you no longer wish to track a city, simply select
            the city within the home page. At the bottom of the
            page, there will be an option to delete the city.
          </p>
        </div>
      </Modal>

        </nav>
    </header>
</template>


<script setup>
// Dont need template because of tailwind; in the above, sm is breakpoint for the screen to change to a row
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Modal from './Modal.vue';
import { uid } from "uid";

const modalActive = ref(null);
const toggleModal = () => 
{
    modalActive.value = !modalActive.value;
}

const savedCities = ref([]);
const route = useRoute();
const router = useRouter(); // get rid of preview

const addCity = async () => {
  const locationObj = {
    territory: route.params.state,
    city: route.params.city,
    lat: route.query.lat,
    long: route.query.long,
  };
  
console.log("2. " + locationObj.territory)
console.log(locationObj.city)
console.log(locationObj.lat)
console.log(locationObj.long)

  try {
    console.log("try in sitenav")
    const response = await fetch('/api/addCity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationObj),
    });
    const savedCity = await response.json();
    savedCities.value.push(savedCity);

    console.log('City saved:', savedCity);
    // Handle any post-save actions, like updating UI or local state
  } catch (error) {
    console.log("error in sitenav")
    console.error('Error saving city:', error);
  }

  // Remove the preview tab
  let query = Object.assign({}, route.query)
  delete query.preview;
  router.replace({query})
};

</script>

