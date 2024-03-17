<template>
     <div class="flex flex-col flex-1 items-center px-4 md:px-6 lg:px-8"> <!-- Responsive padding -->
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="text-white p-4 bg-weather-secondary w-full text-center"
    >
      <p>
        You are currently previewing this city, click the "+"
        icon to start tracking this city.
      </p>
    </div>

    <!-- Weather Overview -->
    <div class="flex flex-col items-center text-white py-12">
        <h1 class="text-4xl mb-2">{{ route.params.city}} </h1>
        <p>{{ new Date(weatherData.location.localtime).toLocaleString() }}</p>
        <p class="text-8xl mb-8">
        {{ Math.round(weatherData.current.temp_f) }}&deg;
      </p>
      <p class="capitalize">
        {{ weatherData.current.condition.text}}
      </p>
      <p>
        Feels like
        {{ Math.round(weatherData.current.feelslike_f) }} &deg;
      </p>
      <img
        class="w-[150px] h-auto"
        :src=weatherData.current.condition.icon
        alt=""
      />
        
    </div>

    <!-- Seperation -->
    <hr class="border-white border-opacity-10 border w-full" />

    <!-- Hour Weather -->
    <!--
<div class="text-white">
    
    <div class="overflow-x-auto">
      <div class="flex whitespace-nowrap">
        
        <div v-for="hourData in next24Hours" :key="hourData.time_epoch" class="flex-none mx-2 my-4">
          
          <div class="flex flex-col items-center text-center">
            
            <p class="text-sm mb-1">
              {{ new Date(hourData.time).toLocaleTimeString("en-us", { hour: 'numeric', minute: 'numeric' }) }}
            </p>
           
            <img class="w-10 h-10 mb-1" :src="hourData.condition.icon" alt="Weather Icon" />
            
            <p class="text-md">{{ Math.round(hourData.temp_f) }}&deg;</p>
          </div>
        </div>
      </div>
    </div>
  </div>
-->

     <!-- Hourly Weather -->
     <div class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Hourly Weather</h2>
        <div class="flex gap-10 overflow-x-scroll">
          <div v-for="hourData in next24Hours" :key="hourData.time_epoch" class="flex-none mx-2 my-4">
            <p class="whitespace-nowrap text-md">
              {{ new Date(hourData.time).toLocaleTimeString("en-us", { hour: 'numeric', minute: 'numeric' }) }}
            </p>
            <img
              class="w-auto h-[50px] object-cover"
              :src="hourData.condition.icon"
              alt="Weather Icon"
            />
            <p class="text-xl">
              {{ Math.round(hourData.temp_f) }}&deg;
            </p>
          </div>
        </div>
      </div>
    </div>


  <hr class="border-white border-opacity-10 border w-full" />

<!-- Weekly Weather -->
<div class="max-w-screen-md w-full py-12">
  <div class="mx-8 text-white">
    <h2 class="mb-4">3 Day Forecast</h2>
    <div
      v-for="day in weatherData.forecast.forecastday"
      :key="day.date"
      class="flex items-center"
    >
      <p class="flex-1">
        {{
          new Date(day.date).toLocaleDateString(
            "en-us",
            {
              weekday: "long",
            }
          )
        }}
      </p>
      <img
        class="w-[50px] h-[50px] object-cover"
        :src="day.day.condition.icon"
        :alt="day.day.condition.text"
      />
      <div class="flex gap-2 flex-1 justify-end">
        <p>H: {{ Math.round(day.day.maxtemp_f) }}&deg;</p>
        <p>L: {{ Math.round(day.day.mintemp_f) }}&deg;</p>
        <p>Rain: {{ Math.round(day.day.daily_chance_of_rain) }}%</p>
      </div>
    </div>
  </div>
</div>


     </div>
</template>

<script setup>
import { computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const WEATHER_API_KEY = '49cf6cb4542846d2a39194046241101'
const getWeatherData = async () => {
    try {
        const response = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${route.query.lat},${route.query.long}&days=7&aqi=no&alerts=no`
          );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const weatherData = await getWeatherData();

const next24Hours = computed(() => {
    const hours = [];
    const currentTime = new Date();
    if (weatherData && weatherData.forecast && weatherData.forecast.forecastday) {
        for (let day of weatherData.forecast.forecastday) {
            for (let hour of day.hour) {
                let hourTime = new Date(hour.time);
                if (hourTime > currentTime && hours.length < 24) {
                    hours.push(hour);
                }
            }
            if (hours.length >= 24) {
                break;
            }
        }
    }
    return hours;
});
</script>

