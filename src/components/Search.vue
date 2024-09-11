<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div :class="$style.searchContainer">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      placeholder="Search tasks..."
      :class="$style.searchInput"
    />
  </div>
</template>

<style module>
.searchContainer {
  max-width: 50rem;
  margin: 0 auto;
  margin-bottom: calc(4 * var(--spacing));
}

.searchInput {
  width: -webkit-fill-available;
  padding: calc(var(--spacing) * 2);
  border: 1px solid #b624ff;
  border-radius: calc(var(--spacing));
  font-size: 1rem;
}
</style>
