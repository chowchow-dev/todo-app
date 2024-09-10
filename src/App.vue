<script setup>
import { ref, computed, watch } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoItem from './components/TodoItem.vue'
import { nanoid } from 'nanoid'
import { useLocalStorage } from './composables/useLocalStorage'

const localStorage = useLocalStorage('tasks')

const tasks = ref(localStorage.getLocalData() || [])

const draggedTask = ref(null)
const dragOverIndex = ref(null)
const draggedItemId = ref(null)

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

const handleDragStart = (task, index, section) => {
  draggedTask.value = { task, index, section }
  draggedItemId.value = task.id
}

const handleDragOver = (index) => {
  dragOverIndex.value = index
}

const handleDragEnd = () => {
  draggedItemId.value = null
}

const handleDrop = () => {
  if (!draggedTask.value || dragOverIndex.value === null) return

  const { task, index: oldIndex, section: oldSection } = draggedTask.value
  const newIndex = dragOverIndex.value

  // Remove the task from its original position
  tasks.value.splice(oldIndex, 1)

  // Insert the task at its new position
  tasks.value.splice(newIndex, 0, task)

  // Update the task's completed status if it's moved between sections
  if (oldSection !== (newIndex < todoTasks.value.length ? 'todo' : 'completed')) {
    task.completed = !task.completed
  }

  draggedTask.value = null
  dragOverIndex.value = null
}

watch(
  tasks,
  (newTasks) => {
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
        :task="todo"
        :dragIndex="index"
        :isDragOver="dragOverIndex === index"
        :isDragging="draggedItemId === todo.id"
        @complete="handleComplete"
        @delete="handleDelete"
        @dragstart="() => handleDragStart(todo, index, 'todo')"
        @dragover="() => handleDragOver(index)"
        @dragend="handleDragEnd"
        @drop="handleDrop"
      />
    </template>

    <template v-if="completedTasks.length > 0">
      <li :class="$style.divider">Completed</li>
      <TodoItem
        v-for="(completed, index) in completedTasks"
        :key="completed.id"
        :task="completed"
        :dragIndex="todoTasks.length + index"
        :isDragOver="dragOverIndex === todoTasks.length + index"
        :isDragging="draggedItemId === completed.id"
        @reopen="handleReopen"
        @delete="handleDelete"
        @dragstart="() => handleDragStart(completed, todoTasks.length + index, 'completed')"
        @dragover="() => handleDragOver(todoTasks.length + index)"
        @dragend="handleDragEnd"
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
