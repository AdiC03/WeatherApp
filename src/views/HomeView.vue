<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <!-- Input field -->
      <input type="text"
      v-model="searchQuery"
      @input="getSearchResults"
      placeholder="Search for city or state"
      class="py-2 px-1 w-full bg-transparent border-b
      focus:border-weather-secondary focus:outline-none
      focus:shadow-[0px_1px_0_0_#004E71]">

    <!-- ul class: unordered list (li is a list tag also)-->
    <!-- There's the v-if statement (not displaying anything if no search results) and the v-for loop to iterate through the list -->
    <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px] z-10"
        v-if="mapboxSearchResults"
    >
      <p class = "py-2" v-if= "searchError"> Sorry, something went wrong. Please try again. </p>
      <p class = "py-2" v-if="!searchError && mapboxSearchResults.length === 0"> No results match, try a different phrase. </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
  </main>
</template>


<script setup>
import { ref } from "vue";
import  axios from "axios";
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";
// Ref is used to mark items to be used later on in the template; used as reactive state
// Arrow functions are just regular functions essentially


// API key 'map':
  
  const searchQuery = ref("");
  const searchTimeOut = ref(null);
  const mapboxSearchResults = ref(null);
  const searchError = ref(null);


  const MAPBOX_API_KEY = "pk.eyJ1IjoiYWRpY2hpbnRhbGEiLCJhIjoiY2xyNnpsNTJmMDNuYzJscWFkNnBjaWc0ayJ9.Df0KNhdAB8zXPNIQDDpqzg"

  // Creates a timeout and then makes a request if search isn't null
  const getSearchResults = () =>
  {
    clearTimeout(searchTimeOut.value); // This is needed for "lazy search"
    searchTimeOut.value = setTimeout(async () => {
      if (searchQuery.value !== "")
      {
        try
        {
            // await lets the function finish completely first 'need to have asynchronous function'
          // types=place only gets the place on the api call
          const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${MAPBOX_API_KEY}&types=place`
        );
          mapboxSearchResults.value = result.data.features;

        }

        catch 
        {
            searchError.value = true;
        }
      
      return;
      }
      mapboxSearchResults.value = null;
    }, 300)
  };

  const router = useRouter();

  const previewCity = (searchResult) => {
    console.log(searchResult);
    // Split method

    /*
    const parts = searchResult.place_name.split(", ");
    console.log(parts[0]);
    console.log(parts[1]);

    if (parts[2] != null)
      console.log(parts[2]);
    */

    // geometry -> coordinates are property of a given search result
    const [city, state] = searchResult.place_name.split(",");
    router.push({
      name: 'cityView',
      params: {
        state: state.replaceAll(" ", ""),
        city: city
      },
      query: {
        lat: searchResult.geometry.coordinates[1],
        long: searchResult.geometry.coordinates[0],
        preview: true, 
      }
    })
    console.log(state + "1");
    console.log(city + "1");
  };

</script>

<style lang="scss" scoped></style>
