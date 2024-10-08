<script setup>
import { ref, computed, watch } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoItem from './components/TodoItem.vue'
import { nanoid } from 'nanoid'
import { useLocalStorage } from './composables/useLocalStorage'

const localStorage = useLocalStorage('tasks')

const tasks = ref(localStorage.getLocalData() || [])
const draggedTask = ref(null)
const draggedOverId = ref(null)
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

const handleDragStart = (task, id, section) => {
  draggedTask.value = { task, id, section }
  draggedItemId.value = id
}

const handleDragOver = (id) => {
  draggedOverId.value = id
}

const handleDragEnd = () => {
  draggedItemId.value = null
}

const handleDrop = () => {
  if (!draggedTask.value || draggedOverId.value === null) return

  const { task, id: oldId, section: oldSection } = draggedTask.value
  const newId = draggedOverId.value

  const newSection = todoTasks.value.some((t) => t.id === newId) ? 'todo' : 'completed'

  if (oldSection !== newSection) {
    draggedTask.value = null
    draggedOverId.value = null
    return
  }

  const oldIndex = tasks.value.findIndex((t) => t.id === oldId)
  const newIndex = tasks.value.findIndex((t) => t.id === newId)

  tasks.value.splice(oldIndex, 1)
  tasks.value.splice(newIndex, 0, task)

  draggedTask.value = null
  draggedOverId.value = null
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
        v-for="todo in todoTasks"
        :key="todo.id"
        :task="todo"
        :dragId="todo.id"
        :isDragOver="draggedOverId === todo.id"
        :isDragging="draggedItemId === todo.id"
        @complete="handleComplete"
        @delete="handleDelete"
        @dragstart="() => handleDragStart(todo, todo.id, 'todo')"
        @dragover="() => handleDragOver(todo.id)"
        @dragend="handleDragEnd"
        @drop="handleDrop"
      />
    </template>

    <template v-if="completedTasks.length > 0">
      <li :class="$style.divider">Completed</li>
      <TodoItem
        v-for="completed in completedTasks"
        :key="completed.id"
        :task="completed"
        :dragId="completed.id"
        :isDragOver="draggedOverId === completed.id"
        :isDragging="draggedItemId === completed.id"
        @reopen="handleReopen"
        @delete="handleDelete"
        @dragstart="() => handleDragStart(completed, completed.id, 'completed')"
        @dragover="() => handleDragOver(completed.id)"
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
