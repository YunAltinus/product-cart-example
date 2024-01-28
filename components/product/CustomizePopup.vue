<script setup>
import { useProduct } from "~/store"
import { getLocalItem, setLocalItem } from "~/composables/useLocalStorage"

const productStore = useProduct()

const router = useRouter()

const props = defineProps({
    isDownloadProductDialog: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(["deletePopup"])

const deletePopup = () => {
    emits("deletePopup")
}

const uploadedImage = ref(null)

const onFileChanged = async ($event) => {
    const target = $event.target;

    if (target && target.files) {
        const file = target.files[0];
        const fileInfo = await readFile(file)
        uploadedImage.value = fileInfo
    }
}

async function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const image = new Image()
            image.onload = () => {
                resolve({
                    imageUrl: event.target.result,
                    file,
                    filename: file.name,
                    fileSize: file.size,
                })
            }
            image.src = event.target.result
        }
        reader.readAsDataURL(file)
    })
}

const addProductToCart = () => {
    const cart = getLocalItem("cart")

    const price = productStore.selectedVariant.discountData.isDiscounted
        ? productStore.selectedVariant.discountData.finalPrice
        : productStore.selectedVariant.price;

    cart.push({
        id: cart.length,
        cartItemTitle: productStore.product.productTitle,
        cartItemSize: productStore.selectedSize.size,
        cartItemColor: productStore.selectedColorData.colorName,
        cartItemPrice: price,
        cartItemImage: uploadedImage.value,
        cartItemQuantity: productStore.productQuantityToCart,
        cartItemTotalPrice: parseInt(productStore.productQuantityToCart) * parseInt(price)
    })

    setLocalItem("cart", cart)

    uploadedImage.value = null

    router.push({ name: 'cart' })
}

const deleteImage = () => {
    uploadedImage.value = null
}
</script>

<template>
    <div v-if="isDownloadProductDialog"
        class="overflow-y-hidden h-[100vh] fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center w-[100vw] ">
        <div id="default-modal" tabindex="-1" aria-hidden="true"
            class="justify-center items-center w-full max-h-full flex ">
            <div class="relative p-4 w-full max-w-2xl max-h-full">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Terms of Service
                        </h3>
                        <button @click="deletePopup" type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="default-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-4 md:p-5 space-y-4">

                        <label v-if="!uploadedImage" for="dropzone-file"
                            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click
                                        to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" @change=onFileChanged($event) />
                        </label>
                        <div id="image-wrapper" class="w-full h-full relative" v-else>
                            <img class="object-contain" :src="uploadedImage.imageUrl" />
                            <div @click="deleteImage"
                                class=" cursor-pointer w-10 h-10 bg-red-500 text-white rounded-full absolute right-3 top-3 flex items-center justify-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="w-6 h-6 bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                    <path
                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <!-- Modal footer -->
                    <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button @click="addProductToCart" :disabled="!uploadedImage" type="button"
                            :class="[!uploadedImage && 'cursor-not-allowed']"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I
                            accept
                        </button>
                        <button @click="deletePopup" data-modal-hide="default-modal" type="button"
                            class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>