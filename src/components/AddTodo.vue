<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const newTaskInput = ref('')
const isFocused = ref(false)

const handleSubmit = (e) => {
  e.preventDefault()
  if (newTaskInput.value.trim()) {
    emit('add', newTaskInput.value)
    newTaskInput.value = ''
  }
}
</script>
<template>
  <form :class="$style.formContainer" @submit.prevent="handleSubmit">
    <div :class="$style.newTaskForm">
      <label for="new-task">➕ Add a task</label>
      <input
        :class="[$style.newTaskInput, { [$style.focused]: isFocused }]"
        id="new-task"
        autocomplete="off"
        type="text"
        placeholder="Try typing 'Buy milk'"
        title="Click to start adding a task"
        v-model="newTaskInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <input type="submit" value="➡️" />
    </div>
  </form>
</template>
<style module>
.formContainer {
  max-width: 50rem;
  margin: 0 auto;
}

.newTaskForm {
  display: flex;
  align-items: center;
  gap: var(--spacing);
  color: var(--color);
  background: var(--task-background);
  padding: calc(2 * var(--spacing));
  border-radius: calc(var(--spacing) / 2);
  width: calc(100% - 4 * var(--spacing));
  max-width: 50rem;
}

.newTaskForm label {
  cursor: text;
  flex-shrink: 0;
}

.newTaskInput {
  padding: var(--spacing);
  opacity: 0;
  flex: 1;
  color: var(--color);
  width: 100%;
  outline: none;
}

.focused {
  opacity: 1;
}
</style>
