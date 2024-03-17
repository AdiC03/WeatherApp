<template>
    <div class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer relative"> <!-- Note the 'relative' class added here -->


        <div class="flex flex-col flex-1">
            <h2 class="text-3xl">{{ city.name }}</h2>
            <h3>{{ city.region }}</h3>
        </div>
        
        <div class="flex flex-col gap-2 items-end">
            
            <button
                class="absolute top-0 right-0 mt-0 mr-0 text-xl"
                @click.stop="deleteCity(city.id)"
                >
                X
            </button>

            <p class="text-3xl">
                {{ Math.round(city.current.temp_f) }}&deg;F
            </p>
            <div class="flex gap-2">
                <span class="text-xs">
                    H: {{ Math.round(city.forecast.forecastday[0].day.maxtemp_f) }}&deg;F
                </span>
                <span class="text-xs">
                    L: {{ Math.round(city.forecast.forecastday[0].day.mintemp_f) }}&deg;F
                </span>
            </div>
        </div>
    </div>
</template>


<script setup>
import axios from "axios";
import { defineEmits } from 'vue';

const emits = defineEmits(['cityDeleted']);


console.log("reached citycard")
defineProps({
    city: {
        type: Object,
        default: () => ({}),
    },
});

const deleteCity = async (cityId) => {
    try {
        // Construct the URL with the actual city ID
        const url = `/api/delete/${cityId}`;
        const response = await axios.delete(url); // delete request
        console.log(response.data.message); 
        emits('cityDeleted', cityId); // Triggers refresh of city parent component and removes the city
    } catch (error) {
        console.error('Error deleting city:', error.response ? error.response.data : error);
    }
}


</script>
