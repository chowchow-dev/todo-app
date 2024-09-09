<script setup>
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'complete', 'reopen'])

const handleDelete = () => {
  emit('delete', props.todo.id)
}

const handleClickTask = () => {
  if (props.todo.completed) {
    emit('reopen', props.todo.id)
  } else {
    emit('complete', props.todo.id)
  }
}
</script>
<template>
  <li :class="[$style.task, { [$style.completed]: todo.completed }]" @click.stop="handleClickTask">
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
      type="button"
      title="Delete task"
      :data-task="todo.id"
      :class="$style.delete"
      @click.stop="handleDelete"
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

.task .box {
  appearance: none;
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 1rem - 3 * var(--spacing));
  height: 100%;
}

.task label {
  cursor: pointer;
  flex: 1;
  display: flex;
  gap: var(--spacing);
  align-items: center;
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
