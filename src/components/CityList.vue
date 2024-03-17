<template>
  <div v-for="city in savedCities" :key="city.id">
    <!-- Add the listener for cityDeleted event -->
    <CityCard :city="city" @cityDeleted="handleCityDeleted" @click="goToCityView(city)" />
  </div>
  
  <p v-if="savedCities.length === 0">
    No locations added. To start tracking a location, search in the field above.
  </p>
</template>

  <script setup>
  import axios from "axios";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import CityCard from "./CityCard.vue";
  
  const savedCities = ref([]);
  
  const handleCityDeleted = (deletedCityId) => {
  // Remove the deleted city from savedCities by filtering it out
  savedCities.value = savedCities.value.filter(city => city.id !== deletedCityId);
};

  const WEATHER_API_KEY = '49cf6cb4542846d2a39194046241101'
  
  const getCities = async () => {
  try {
    // Retrieve saved cities from your database
    const response = await axios.get('/api/cities');
    console.log("respomse" + response)
    savedCities.value = response.data;
    console.log("saved city" + savedCities.value)

    // Retrieve weather data for each saved city
    const weatherRequests = savedCities.value.map((city) =>
      axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city.latitude},${city.longitude}&days=1&aqi=no&alerts=no`
      )
    );

    const weatherData = await Promise.all(weatherRequests);

    // Combine weather data with city data from your database
    savedCities.value = savedCities.value.map((city, index) => {
      // Match the property names with those from your database and the weather API
      return {
        id: city.id, // Future fix maybe to take out ID entirely since no need for it
        name: city.city,
        region: city.territory,
        lat: city.latitude,
        lon: city.longitude,
        current: weatherData[index].data.current,
        forecast: weatherData[index].data.forecast,
      };
    });

  } catch (error) {
    console.error('Error retrieving cities:', error);
  }
};

  await getCities();
  
  const router = useRouter();
  const goToCityView = (city) => {
    router.push({
      name: "cityView",
      params: { state: city.state, city: city.city },
      query: {
        id: city.id,
        lat: city.coords.lat,
        lng: city.coords.lng,
      },
    });
  };
  </script>
