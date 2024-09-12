<script setup>
import { ref, watch, computed } from 'vue'
import { nanoid } from 'nanoid'

import TodoItem from './components/TodoItem.vue'
import { useLocalStorage } from './composables/useLocalStorage'
import SearchTasks from './components/Search.vue'
import TaskDialog from './components/TaskDialog.vue'

const localStorage = useLocalStorage('tasks')

const tasks = ref(localStorage.getLocalData() || [])
const draggedTask = ref(null)
const draggedOverId = ref(null)
const draggedItemId = ref(null)

const taskDialogVisible = ref(false)
const editingTask = ref(null)

const searchQuery = ref('')

const filteredTasks = computed(() => {
  if (!searchQuery.value) return tasks.value
  return tasks.value.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.desc && task.desc.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

const handleReopenOrCompleteTask = (id) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed }
    }
    return task
  })
}

const handleAdd = (task) => {
  const newTask = { ...task, id: nanoid(), completed: false, createdAt: new Date().toISOString() }
  tasks.value = [newTask, ...tasks.value]
}

const handleEdit = (task) => {
  const updatedTasks = tasks.value.map((t) => (t.id === task.id ? { ...t, ...task } : t))
  tasks.value = updatedTasks
}

const handleSubmitTask = (task) => {
  if (task.id) {
    handleEdit(task)
    editingTask.value = null
  } else {
    handleAdd(task)
  }
  taskDialogVisible.value = false
}

const handleDelete = (id) => {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

const handleDragStart = (task, id) => {
  draggedTask.value = { task, id }
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

  const { task, id: oldId } = draggedTask.value
  const newId = draggedOverId.value

  const oldIndex = tasks.value.findIndex((t) => t.id === oldId)
  const newIndex = tasks.value.findIndex((t) => t.id === newId)

  tasks.value.splice(oldIndex, 1)
  tasks.value.splice(newIndex, 0, task)

  draggedTask.value = null
  draggedOverId.value = null
}

const handleDuplicate = (id) => {
  const task = tasks.value.find((t) => t.id === id)
  if (task) {
    const newTask = { ...task, id: nanoid(), createdAt: new Date().toISOString() }
    tasks.value = [newTask, ...tasks.value]
  }
}

const handleSearch = (query) => {
  searchQuery.value = query
}

// TODO: impl this feature later
// const handlePin = (id) => {
//   tasks.value = tasks.value.map((task) => {
//     if (task.id === id) {
//       return { ...task, pinned: !task.pinned }
//     }
//     return task
//   })
// }

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

  <template v-if="tasks.length > 0">
    <SearchTasks @search="handleSearch" />

    <ul :class="$style.todoList">
      <TodoItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :dragId="task.id"
        :isDragOver="draggedOverId === task.id"
        :isDragging="draggedItemId === task.id"
        @reopenOrCompleteTask="handleReopenOrCompleteTask"
        @delete="handleDelete"
        @edit="
          (task) => {
            editingTask = task
            taskDialogVisible = true
          }
        "
        @duplicate="handleDuplicate"
        @pin="handlePin"
        @dragstart="() => handleDragStart(task, task.id, 'todo')"
        @dragover="() => handleDragOver(task.id)"
        @dragend="handleDragEnd"
        @drop="handleDrop"
      />
    </ul>
  </template>

  <template v-else>
    <div :class="$style.emptyTaskText">
      <p :class="$style.emptyTaskTextTitle">No tasks defined</p>
      <p :class="$style.emptyTaskTextSubtitle">Click on the + button to add a new task</p>
    </div>
  </template>

  <el-button
    circle
    type="default"
    icon="Plus"
    :class="$style.addButton"
    @click="
      () => {
        editingTask = null
        taskDialogVisible = true
      }
    "
  />

  <TaskDialog
    :visible="taskDialogVisible"
    :initialData="editingTask"
    @onSubmit="handleSubmitTask"
    @onClose="
      () => {
        taskDialogVisible = false
        editingTask = null
      }
    "
  />
</template>

<style module>
.title {
  text-align: center;
}

.emptyTaskText {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-top: calc(50vh - 113px - (113px / 2));
}

.emptyTaskTextTitle {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.emptyTaskTextSubtitle {
  font-size: 1rem;
  font-weight: normal;
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

.addButton {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px !important;
  height: 64px;
  background-color: #b624ff;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: none;
}

.addButton svg {
  width: 24px;
  height: 24px;
  color: white;
}

.addButton:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background-color: #b624ff;
  opacity: 0.8;
}

.addButton:active {
  transform: scale(0.95);
}
</style>
