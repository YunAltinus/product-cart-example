import { defineStore } from "pinia";

import { getLocalItem } from "~/composables/useLocalStorage";

export const useProduct = defineStore("product", {
  state: () => ({
    product: {},

    selectedSize: {},
    selectedVariant: {},
    selectedColorData: {},
    selectedImage: {},

    productQuantityToCart: 1,
    productMaterials: [],
    productFeatures: [],

    cartItemsLength: 0,
  }),

  getters: {
    getCartsItemLength() {
      return this.cartItemsLength;
    },

    getUnSelectedImages() {
      return this.product.images.filter(
        (image) => image.listNumber != this.selectedImage.listNumber
      );
    },

    getColorsByVariant() {
      return this.selectedSize.variants.map((variant) => {
        return variant.colorData.colorId;
      });
    },

    getProductColors() {
      return this.product.productColors;
    },
  },

  actions: {
    setCartsItemLength(cartItemsLength) {
      this.cartItemsLength = cartItemsLength;
    },

    setProductQuantity(action) {
      if (action == "plus") {
        if (this.selectedVariant.stock > this.productQuantityToCart) {
          this.productQuantityToCart++;
        }
      } else {
        if (this.productQuantityToCart > 1) {
          this.productQuantityToCart--;
        }
      }
    },

    setSelectedSize(size = this.product.variantsData[0]) {
      this.selectedSize = size;
    },

    setSelectedImage(
      image = this.product.images.find((image) => image.listNumber === 1)
    ) {
      this.selectedImage = image;
    },

    setSelectedVariant(variant = this.selectedSize.variants[0]) {
      this.selectedVariant = variant;
    },

    setSelectedColorData(colorData = this.selectedVariant.colorData) {
      this.selectedColorData = colorData;
    },

    async fetchProduct() {
      // or on composable
      const { data, pending, error } = await useFetch(
        `${useRuntimeConfig().public.BASE_URI}/get/product`,
        {
          method: "POST",
          body: {
            groupName: "womens",
            typeName: "shirts",
            productName: "unisex-staple-t-shirt-bella-canvas-3001",
          },
        }
      );
      if (!error.value) {
        this.product = data.value.data;
        this.product.productColors.map((productColor) => {
          productColor.colorCode = productColor.code;
        });
        this.product.productColors.unshift({
          colorCode: "#c85313",
          colorId: 6,
          colorName: "Autumn",
          imageUrl: "",
          isHeather: false,
        });

        this.setSelectedImage();
        this.setSelectedSize();
        this.setSelectedVariant();
        this.setSelectedColorData();
      }
    },

    async fetchProductFeatures() {
      // or on composable
      const { data, pending, error } = await useFetch(
        `${useRuntimeConfig().public.BASE_URI}/get_features/by_product_id`,
        {
          method: "POST",
          body: {
            productId: this.product.productId,
          },
        }
      );

      if (data.value.error) {
        console.log(data.value.message);
      }

      if (!error.value && !data.value.error) {
        this.productFeatures = data.value.data;
      }
    },

    async fetchProductMaterials() {
      // or on composable
      const { data, pending, error } = await useFetch(
        `${useRuntimeConfig().public.BASE_URI}/get_materials/by_product_id`,
        {
          method: "POST",
          body: {
            productId: this.product.productId,
          },
        }
      );

      if (data.value.error) {
        console.log(data.value.message);
      }

      if (!error.value && !data.value.error) {
        this.productMaterials = data.value.data;
      }
    },
  },
});
