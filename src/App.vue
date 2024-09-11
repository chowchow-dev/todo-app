<script setup>
import { ref, watch } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoItem from './components/TodoItem.vue'
import { nanoid } from 'nanoid'
import { useLocalStorage } from './composables/useLocalStorage'
import FormCreateTask from './components/FormCreateTask.vue'

const localStorage = useLocalStorage('tasks')

const tasks = ref(localStorage.getLocalData() || [])
const draggedTask = ref(null)
const draggedOverId = ref(null)
const draggedItemId = ref(null)

const createTaskDialogVisible = ref(false)

const handleReopenOrCompleteTask = (id) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed }
    }
    return task
  })
}

const handleAdd = (task) => {
  const newTask = { id: nanoid(), ...task, completed: false, createdAt: new Date().toISOString() }
  tasks.value = [newTask, ...tasks.value]
}

const handleDelete = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

// TODO: cleanup this function
const handleDragStart = (task, id) => {
  console.log('drag start')
  draggedTask.value = { task, id }
  draggedItemId.value = id
}

const handleDragOver = (id) => {
  console.log('drag over', id)
  draggedOverId.value = id
}

const handleDragEnd = () => {
  console.log('drag end')
  draggedItemId.value = null
}

const handleDrop = () => {
  if (!draggedTask.value || draggedOverId.value === null) return

  const { task, id: oldId } = draggedTask.value
  const newId = draggedOverId.value

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
  <!-- <pre>{{ tasks }}</pre> -->
  <h1 :class="$style.title">📋 My tasks</h1>

  <ul :class="$style.todoList">
    <div :class="$style.emptyTaskText" v-if="tasks.length === 0">No tasks defined</div>
    <template v-else>
      <TodoItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :dragId="task.id"
        :isDragOver="draggedOverId === task.id"
        :isDragging="draggedItemId === task.id"
        @reopenOrCompleteTask="handleReopenOrCompleteTask"
        @dragstart="() => handleDragStart(task, task.id, 'todo')"
        @dragover="() => handleDragOver(task.id)"
        @dragend="handleDragEnd"
        @drop="handleDrop"
        @delete="handleDelete"
      />
    </template>
  </ul>

  <el-button circle type="default" icon="Plus" @click="createTaskDialogVisible = true" />

  <FormCreateTask
    :visible="createTaskDialogVisible"
    @onAddTask="handleAdd"
    @onClose="createTaskDialogVisible = false"
  />
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
