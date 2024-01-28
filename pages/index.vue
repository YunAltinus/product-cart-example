<script setup>
import { useProduct } from "~/store"
import { getLocalItem, setLocalItem } from "~/composables/useLocalStorage"

const productStore = useProduct()

await callOnce(() => productStore.fetchProduct());

await callOnce(() => Promise.all([productStore.fetchProductMaterials(), productStore.fetchProductFeatures()]))

useServerSeoMeta({
    title: () => productStore.product.productTitle,
    description: () => productStore.product.productDescription,
    ogTitle: () => productStore.product.productTitle,
    ogDescription: () => productStore.product.productDescription,
    ogUrl: () => "http://localhost:3000"
})

const isDownloadProductDialog = ref(false)

const selectSize = (size) => {
    productStore.setSelectedSize(size)
    productStore.setSelectedVariant()
    productStore.setSelectedColorData()
}

const openPopup = () => {
    isDownloadProductDialog.value = !isDownloadProductDialog.value
}

onMounted(() => {
    if (!getLocalItem("cart")) {
        setLocalItem("cart", [])
    }
})
</script>

<template>
    <ProductCustomizePopup :isDownloadProductDialog="isDownloadProductDialog" @deletePopup="openPopup" />

    <section class="overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800">
        <div class="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
            <div class="flex flex-wrap -mx-4">
                <div class="w-full px-4 md:w-1/2 ">
                    <div class="sticky top-0 z-50 overflow-hidden ">
                        <div class="relative mb-6 lg:mb-10 lg:h-2/4 ">
                            <img :style="`background-color: ${productStore.selectedColorData.colorCode}`"
                                :src="`${useRuntimeConfig().public.IMAGE_URI}/${productStore.selectedImage.url}`" alt=""
                                class="object-cover w-full lg:h-full ">
                        </div>
                        <div class="flex-wrap hidden md:flex ">
                            <div class="w-1/2 p-2 sm:w-1/4" v-for="image in productStore.getUnSelectedImages"
                                :key="image.listNumber">

                                <div @click="productStore.setSelectedImage(image)"
                                    class="cursor-pointer block border border-blue-300 dark:border-transparent dark:hover:border-blue-300 hover:border-blue-300">
                                    <img :style="`background-color: ${productStore.selectedColorData.colorCode}`"
                                        :src="`${useRuntimeConfig().public.IMAGE_URI}/${image.url}`" alt=""
                                        class="object-cover w-full lg:h-full ">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full px-4 md:w-1/2 ">
                    <div class="lg:pl-20">
                        <div class="mb-8 ">
                            <h2 class="max-w-xl mt-2 mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl">
                                {{ productStore.product.productTitle }}
                            </h2>

                            <p class="inline-block mb-8 text-4xl font-bold text-gray-700 dark:text-gray-400 ">
                                <template v-if="productStore.selectedVariant.discountData.isDiscounted">
                                    <span>${{ productStore.selectedVariant.discountData.finalPrice }}</span>
                                    <span class="text-base font-normal text-gray-500 line-through dark:text-gray-400">
                                        ${{ `${productStore.selectedVariant.price}` }}
                                    </span>
                                    <span class="text-base font-semibold text-red-500  dark:text-gray-400">
                                        &nbsp;%{{ `${productStore.selectedVariant.discountData.discountValue}` }} discount
                                    </span>
                                </template>
                                <template v-else>
                                    <span> ${{ productStore.selectedVariant.price }}</span>
                                </template>
                            </p>
                            <p class="text-green-600 dark:text-green-300">
                                {{ productStore.selectedVariant.stock }}
                                in stock
                            </p>
                        </div>


                        <div class="flex items-center mb-8">
                            <h2 class="w-16 mr-6 text-xl font-bold dark:text-gray-400">
                                Colors:</h2>
                            <div class="flex flex-wrap -mx-2 -mb-2">
                                <button v-for="(colorData, index) in productStore.getProductColors" :key="index"
                                    :disabled="!productStore.getColorsByVariant.includes(colorData.colorId)"
                                    @click="productStore.setSelectedColorData(colorData)"
                                    :class="[productStore.selectedColorData.colorId == colorData.colorId && 'border-blue-400']"
                                    class="p-1 mb-2 mr-2 border hover:border-blue-400 dark:border-gray-800 dark:hover:border-gray-400 ">
                                    <div :style="[`background-color: ${colorData.colorCode}`]"
                                        :class="[!productStore.getColorsByVariant.includes(colorData.colorId) && 'bg-red-500 cursor-not-allowed opacity-20']"
                                        class="w-6 h-6"></div>
                                </button>

                            </div>
                        </div>
                        <div class="flex items-center mb-8">
                            <h2 class="w-16 text-xl font-bold dark:text-gray-400">
                                Size:
                            </h2>
                            <div class="flex flex-wrap -mx-2 -mb-2">
                                <template v-for="(sizeData, index) in productStore.product.variantsData" :key="index">
                                    <button @click="selectSize(sizeData)"
                                        :class="[productStore.selectedSize.size == sizeData.size && 'border-blue-400']"
                                        class="py-1 mb-2 mr-1 border w-11 hover:border-blue-400 dark:border-gray-400 hover:text-blue-600 dark:hover:border-gray-300 dark:text-gray-400">

                                        {{ sizeData.size }}
                                    </button>
                                </template>
                            </div>
                        </div>
                        <div class="w-32 mb-8 ">
                            <label for=""
                                class="w-full text-xl font-semibold text-gray-700 dark:text-gray-400">Quantity</label>
                            <div class="relative flex flex-row w-full h-10 mt-4 bg-transparent rounded-lg">
                                <button @click="productStore.setProductQuantity('minus')"
                                    class="w-20 h-full text-gray-600 bg-gray-300 rounded-l outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-400">
                                    <span class="m-auto mb-10 text-2xl font-thin">-</span>
                                </button>
                                <input type="number" disabled
                                    class="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-300 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
                                    v-model="productStore.productQuantityToCart">
                                <button @click="productStore.setProductQuantity('plus')"
                                    class="w-20 h-full text-gray-600 bg-gray-300 rounded-r outline-none cursor-pointer dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-400">
                                    <span class="m-auto text-2xl font-thin">+</span>
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center -mx-4 ">
                            <div class="w-full px-4 mb-4 lg:w-1/2 lg:mb-0">
                                <button @click="openPopup"
                                    class="cursor-pointer flex items-center justify-center w-full p-4 text-blue-500 border border-blue-500 rounded-md dark:text-gray-200 dark:border-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-gray-100 dark:bg-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:hover:text-gray-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-20">

                <div>
                    <h3 class="text-lg font-semibold">
                        Description
                    </h3>
                    <div class="w-full mb-8 text-gray-700 dark:text-gray-400"
                        v-html="productStore.product.productDescription" />
                </div>

                <div class="flex gap-8">
                    <div class="w-1/2">
                        {{ productStore.productMaterials }}
                        <template v-if="productStore.productMaterials?.length > 0">
                            <div v-for="(material, index) in productStore.productMaterials" :key="index">
                                <div class="w-full p-4 mb-8 border border-gray-300 dark:border-gray-700">
                                    <h2 class="mb-4 text-xl font-semibold dark:text-gray-400">{{ material.title }} </h2>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5  dark:bg-gray-600">
                                        <div class="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full"
                                            :style="`width:${material.value}%;`">
                                        </div>
                                    </div>

                                    <div class="flex justify-between items-center">
                                        <div class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-400">
                                            {{ material.lowSubTitle }}
                                        </div>
                                        <div class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-400">
                                            {{ material.maxSubTitle }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <ProductDescription />
                </div>

            </div>
        </div>

    </section>
</template>
<!-- 

<style lang="scss">
.product-section {
   @apply overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800;
}
</style> -->