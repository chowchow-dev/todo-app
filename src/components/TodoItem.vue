<script setup>
const props = defineProps({
  todo: {
    type: Object,
    required: true
  },
  dragIndex: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['delete', 'complete', 'reopen', 'dragstart', 'dragover', 'drop'])

const handleClickDelete = () => {
  emit('delete', props.todo.id)
}

const handleClickTask = () => {
  if (props.todo.completed) {
    emit('reopen', props.todo.id)
  } else {
    emit('complete', props.todo.id)
  }
}

const handleDragStart = (event) => {
  event.dataTransfer.setData('text/plain', props.dragIndex)
  emit('dragstart', props.dragIndex, props.todo.completed ? 'completed' : 'todo')
}

const handleDragOver = (event) => {
  event.preventDefault()
  emit('dragover', props.dragIndex, props.todo.completed ? 'completed' : 'todo')
}

const handleDrop = (event) => {
  event.preventDefault()
  const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'), 10)
  emit('drop', { draggedIndex, targetIndex: props.dragIndex })
}
</script>
<template>
  <li
    :class="[$style.task, { [$style.completed]: todo.completed }]"
    draggable="true"
    @click.stop="handleClickTask"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <label :class="$style.label" :title="todo.completed ? 'Reopen task' : 'Complete task'">
      <input
        type="checkbox"
        :class="$style.box"
        :title="todo.completed ? 'Reopen task' : 'Complete task'"
        :value="todo.id"
        :checked="todo.completed"
      />
      <span :class="$style.text">{{ todo.title }}</span>
    </label>
    <button
      title="Delete task"
      :data-task="todo.id"
      :class="$style.delete"
      @click.stop="handleClickDelete"
    >
      ╳
    </button>
  </li>
</template>
<style module>
.task {
  background: var(--task-background);
  border-radius: calc(var(--spacing) / 2);
  display: flex;
  gap: var(--spacing);
  align-items: center;
  padding: calc(2 * var(--spacing));
  position: relative;
}

.task:hover {
  background: var(--task-hover-background);
}

.task .box {
  height: 100%;
  width: calc(100% - 1rem - 3 * var(--spacing));
  position: absolute;
  top: 0;
  left: 0;
  appearance: none;
}

.task label {
  flex: 1;
  display: flex;
  gap: var(--spacing);
  align-items: center;
  cursor: pointer;
}

.task:hover .delete,
.task .delete:focus-within {
  color: var(--delete-color);
  border-color: var(--delete-color);
}

.task label::before {
  content: '';
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border: 2px solid var(--color);
  border-radius: 50%;
  display: grid;
  place-content: center;
  font-size: 0.9rem;
  font-weight: bold;
}

.task:hover label::before {
  content: '✓';
}

.task.completed label::before {
  color: var(--task-background);
  background: var(--color);
  content: '✓';
  text-decoration: none;
}

.completed .text {
  text-decoration: line-through;
  color: var(--task-completed-color);
}

.delete {
  cursor: pointer;
  font-weight: bold;
  font-size: 0.5rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-content: center;
  transition: all 0.2s;
  color: transparent;
  border: 2px solid transparent;
}
</style>
