<script setup>
import { useProduct } from "~/store"

const productStore = useProduct()
</script>

<template>
    <div class="w-1/2">
        <h1 class="font-bold text-lg">Description</h1>
        <template v-if="productStore.productFeatures?.length > 0">
            <div v-for="(feature, index) in productStore.productFeatures" :key="index">
                <h2 class="font-semibold">{{ feature.title }}</h2>
                <p>{{ feature.description }}</p>
            </div>
        </template>
    </div>
</template>