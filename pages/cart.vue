<script setup>
import { getLocalItem } from '~/composables/useLocalStorage';
import { useProduct } from "~/store"

const productStore = useProduct()

const cart = ref([])

const removeCartItem = (cartItemId) => {
    const cartLocal = getLocalItem("cart")

    cart.value = cartLocal.filter(cartItem => cartItem.id != cartItemId)

    setLocalItem("cart", cart.value)

    productStore.setCartsItemLength(cart.value.length)
}

onMounted(() => {
    cart.value = getLocalItem("cart")
    console.log(cart.value);
})
</script>

<template>
    <section class="h-[100vh] items-center py-24 bg-gray-50 font-poppins dark:bg-gray-700">
        <div class="justify-center flex-1 px-4 py-6 mx-auto max-w-7xl lg:py-4 lg:px-6">
            <h2 class="mb-10 text-4xl font-bold text-center dark:text-gray-400">Your Cart</h2>
            <div class="px-6 mb-10 lg:px-0" v-for="cartItem in cart" :key="cartItem.id">
                <div
                    class="relative flex flex-wrap items-center pb-8 mb-8 -mx-4 border-b border-gray-200 dark:border-gray-500 xl:justify-between border-opacity-40">
                    <div class="w-full mb-4 md:mb-0 h-96 md:h-44 md:w-56">
                        <img :src="cartItem.cartItemImage.imageUrl" alt="" class="object-cover w-full h-full">
                    </div>
                    <div class="w-full px-4 mb-6 md:w-96 xl:mb-0">
                        <a class="block mb-5 text-xl font-medium hover:underline dark:text-gray-400" href="#">
                            {{ cartItem.cartItemTitle }}</a>
                        <div class="flex flex-wrap">
                            <p class="mr-4 text-sm font-medium">
                                <span class="dark:text-gray-400">Color:</span>
                                <span class="ml-2 text-gray-400 dark:text-gray-400">{{ cartItem.cartItemColor }}</span>
                            </p>
                            <p class="text-sm font-medium dark:text-gray-400">
                                <span>Size:</span>
                                <span class="ml-2 text-gray-400">{{ cartItem.cartItemSize }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="w-full px-4 mt-6 mb-6 xl:w-auto xl:mb-0 xl:mt-0">
                        <div class="flex items-center">
                            <h2 class="mr-4 font-medium dark:text-gray-400">Qty:</h2>
                            <div
                                class="inline-flex items-center px-4 font-semibold text-gray-500 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 ">

                                <div type="number"
                                    class="w-12 px-2 py-4 text-center border-0 rounded-md dark:bg-gray-800 bg-gray-50 dark:text-gray-400">
                                    {{ cartItem.cartItemQuantity }}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="w-full px-4 xl:w-auto">
                        <span class="text-xl font-medium text-blue-500 dark:text-blue-400 ">
                            <span class="text-sm">$</span>
                            <span> {{ cartItem.cartItemTotalPrice }}</span>
                        </span>
                    </div>
                    <button @click="removeCartItem(cartItem.id)"
                        class="absolute top-0 right-0 text-gray-400 lg:mt-6 lg:-mr-4 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="w-6 h-6 bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>