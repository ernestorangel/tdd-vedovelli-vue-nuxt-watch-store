<template>
  <main class="my-8">
    <search-bar @doSearch="setSearchTerm"></search-bar>
    <div v-if="!errorMessage.length" class="container mx-auto px-6">
      <h3 class="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
      <span class="mt-3 text-sm text-gray-500">200+ Products</span>
      <div
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
      >
        <product-card
          v-for="product in list"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
    <h3 v-else class="text-center text-2xl">{{ errorMessage }}</h3>
  </main>
</template>

<script>
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: { ProductCard, SearchBar },
  data() {
    return {
      products: [],
      errorMessage: '',
      searchTerm: '',
    };
  },
  computed: {
    list() {
      if (this.searchTerm !== '') {
        return this.products.filter(({ title }) => {
          return title.includes(this.searchTerm);
        });
      }
      return this.products;
    },
  },
  async created() {
    try {
      this.products = (await this.$axios.get('/api/products')).data.products;
    } catch {
      this.errorMessage = 'Problemas ao carregar a lista!';
    }
  },
  methods: {
    setSearchTerm({ term }) {
      this.searchTerm = term;
    },
  },
};
</script>
