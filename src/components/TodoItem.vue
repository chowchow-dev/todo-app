<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  dragId: {
    type: Number,
    required: true
  },
  isDragOver: {
    type: Boolean,
    default: false
  },
  isDragging: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'delete',
  'complete',
  'reopen',
  'dragstart',
  'dragover',
  'dragend',
  'drop'
])

const handleClickDelete = () => {
  emit('delete', props.task.id)
}

const handleClickTask = () => {
  if (props.task.completed) {
    emit('reopen', props.task.id)
  } else {
    emit('complete', props.task.id)
  }
}
</script>
<template>
  <li
    :class="[
      $style.task,
      {
        [$style.completed]: task.completed,
        [$style.dragging]: isDragging,
        [$style.dragOver]: isDragOver
      }
    ]"
    draggable="true"
    @dragstart="$emit('dragstart', dragId)"
    @dragover.prevent="$emit('dragover', dragId)"
    @dragend="$emit('dragend')"
    @drop="$emit('drop')"
    @click.stop="handleClickTask"
  >
    <label :class="$style.label" :title="task.completed ? 'Reopen task' : 'Complete task'">
      <input
        type="checkbox"
        :class="$style.box"
        :title="task.completed ? 'Reopen task' : 'Complete task'"
        :value="task.id"
        :checked="task.completed"
      />
      <span :class="$style.text">{{ task.title }}</span>
    </label>
    <button
      title="Delete task"
      :data-task="task.id"
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

.task {
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.task.dragging {
  opacity: 0.5;
}

.task.dragOver {
  border: 2px solid greenyellow;
}

/* TODO[Improvement]: dragged task should take place of the dragged over task */
/* .task.dragOver {
  transform: translateY(54px);
  background-color: var(--task-hover-background);
} */

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
