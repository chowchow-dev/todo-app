<script setup>
import { ref, computed, watch } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoItem from './components/TodoItem.vue'
import { nanoid } from 'nanoid'
import { useLocalStorage } from './composables/useLocalStorage'

const localStorage = useLocalStorage('tasks')

const tasks = ref(localStorage.getLocalData() || [])

const todoTasks = computed(() => {
  return tasks.value.filter((task) => !task.completed)
})

const completedTasks = computed(() => {
  return tasks.value.filter((task) => task.completed)
})

const handleDelete = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

const handleComplete = (id) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === id) {
      return { ...task, completed: true }
    }
    return task
  })
}

const handleReopen = (id) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === id) {
      return { ...task, completed: false }
    }
    return task
  })
}

const handleAdd = (title) => {
  const newTask = { id: nanoid(), title, completed: false }
  tasks.value = [newTask, ...tasks.value]
}

const draggedIndex = ref(null)
const draggedSection = ref(null)

const handleDragStart = (index, section) => {
  console.log('handleDragStart', index, section)
  draggedIndex.value = index
  draggedSection.value = section
}

const handleDragOver = (index, section) => {
  console.log('handleDragOver', index, section, {
    draggedIndex: draggedIndex.value,
    section: draggedSection.value
  })
  if (draggedIndex.value === null || draggedSection.value !== section) return
  if (draggedIndex.value !== index) {
    const [movedTask] = tasks.value.splice(draggedIndex.value, 1)
    tasks.value.splice(index, 0, movedTask)
    draggedIndex.value = index
  }
}

const handleDrop = () => {
  console.log('handleDrop')
  draggedIndex.value = null
  draggedSection.value = null
}

watch(
  tasks,
  (newTasks) => {
    console.log('tasks', newTasks)
    localStorage.setLocalData(newTasks)
  },
  { deep: true }
)
</script>

<template>
  <h1 :class="$style.title">📋 My tasks</h1>
  <AddTodo @add="handleAdd" />
  <ul :class="$style.todoList">
    <div :class="$style.emptyTaskText" v-if="todoTasks.length === 0">No tasks defined</div>
    <template v-else>
      <li :class="$style.divider">Todo</li>
      <TodoItem
        v-for="(todo, index) in todoTasks"
        :key="todo.id"
        :todo="todo"
        :dragIndex="index"
        @complete="handleComplete"
        @delete="handleDelete"
        @dragstart="(index, section) => handleDragStart(index, section)"
        @dragover="(index, section) => handleDragOver(index, section)"
        @drop="handleDrop"
      />
    </template>

    <template v-if="completedTasks.length > 0">
      <li :class="$style.divider">Completed</li>
      <TodoItem
        v-for="(completed, index) in completedTasks"
        :key="completed.id"
        :todo="completed"
        :dragIndex="todoTasks.length + index"
        @reopen="handleReopen"
        @delete="handleDelete"
        @dragstart="(index, section) => handleDragStart(index, section)"
        @dragover="(index, section) => handleDragOver(index, section)"
        @drop="handleDrop"
      />
    </template>
  </ul>
</template>

<style module>
.title {
  text-align: center;
}

.emptyTaskText,
.divider {
  font-size: 1.5rem;
  font-weight: bold;
  padding: calc(2 * var(--spacing));
  text-align: center;
}

.todoList {
  display: flex;
  flex-direction: column;
  max-width: 50rem;
  margin: 0 auto;
  gap: calc(2 * var(--spacing));
  margin-top: calc(2 * var(--spacing));
}
</style>
