<script setup>
import { More, Close, Check, TopRight, Edit, CopyDocument, Delete } from '@element-plus/icons-vue'

defineProps({
  task: {
    type: Object,
    required: true
  },
  dragId: {
    type: String,
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

defineEmits(['delete', 'reopenOrCompleteTask', 'dragstart', 'dragover', 'dragend', 'drop'])
</script>
<template>
  <li
    :class="[
      $style.task,
      {
        [$style.completed]: task.completed,
        [$style.dragging]: isDragging,
        [$style.dragOver]: isDragOver,
        [$style.high]: task.priority === 'high',
        [$style.medium]: task.priority === 'medium',
        [$style.low]: task.priority === 'low'
      }
    ]"
    draggable="true"
    @dragstart="$emit('dragstart', dragId)"
    @dragover.prevent="$emit('dragover', dragId)"
    @dragend="$emit('dragend')"
    @drop="$emit('drop')"
  >
    <el-icon v-if="task.completed" :class="[$style.icon, $style.iconAnimate]">
      <Check />
    </el-icon>

    <label :class="$style.label" :title="task.completed ? 'Reopen task' : 'Complete task'">
      <div :class="$style.labelText">
        <span :class="$style.text">{{ task.title }}</span>
        <span :class="$style.created">{{ new Date(task.createdAt).toLocaleDateString() }}</span>
      </div>
      <div v-if="task.desc" :class="$style.desc">{{ task.desc }}</div>
      <el-badge
        :class="$style.badge"
        :value="task.priority"
        :type="
          task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'
        "
      />
    </label>

    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <el-icon :class="$style.btnMore">
          <More />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            :icon="task.completed ? Close : Check"
            @click="$emit('reopenOrCompleteTask', task.id)"
          >
            {{ task.completed ? 'Mark as undone' : 'Mark as done' }}
          </el-dropdown-item>
          <!-- <el-dropdown-item :icon="CirclePlus">Pin</el-dropdown-item> -->
          <el-dropdown-item :icon="TopRight" @click="handleClickDetails"
            >Task details</el-dropdown-item
          >
          <el-dropdown-item divided :icon="Edit">Edit</el-dropdown-item>
          <el-dropdown-item :icon="CopyDocument">Duplicate</el-dropdown-item>
          <el-dropdown-item :icon="Delete" @click="$emit('delete', task.id)"
            >Delete</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </li>
</template>
<style module>
.btnDrag {
  cursor: move; /* fallback: no `url()` support or images disabled */
  cursor: -webkit-grab; /* Chrome 1-21, Safari 4+ */
  cursor: -moz-grab; /* Firefox 1.5-26 */
  cursor: grab; /* W3C standards syntax, should come least */
}

.btnDrag.dragging {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: grabbing;
}

.task {
  position: relative;
  border-radius: calc(var(--spacing));
  display: flex;
  gap: var(--spacing);
  align-items: center;
  padding: calc(2 * var(--spacing));
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.task.high {
  background: #ff2f2fcc;
  color: #fff;
}

.task.medium {
  background: #ffea28;
  color: #000;
}

.task.low {
  background: #3dff7fcc;
  color: #000;
}

.task.completed .icon {
  padding: 8px;
  border-radius: 8px;
  margin-right: 8px;
  color: #fff;
}

.task.completed.high .icon {
  background-color: #dddddd9d;
}

.task.completed.medium .icon {
  background-color: #4b4b4b6e;
}

.task.completed.low .icon {
  background-color: #4b4b4b6e;
}

.task.completed {
  border-left: 16px solid #00ff1ee3;
  opacity: 0.8;
  filter: none;
  animation: 0.5s ease-in 0s 1 normal none running animation-completed;
  transition: 0.3s !important;
}

.task.dragging {
  opacity: 0.5;
}

.task.dragOver {
  border: 2px solid greenyellow;
}

.dragBtn {
  cursor: grabbing;
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
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing);
  align-items: center;
}

.completed .text,
.completed .desc {
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
}

.labelText {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.labelText .text {
  font-weight: 600;
}

.badge {
  width: 100%;
  text-transform: capitalize;
}

.created {
  font-size: 0.8rem;
  /* color: var(--task-completed-color); */
  font-style: italic;
}

.desc {
  width: 100%;
  text-align: left;
  font-size: 0.8rem;
  /* color: var(--task-completed-color); */
}

.btnMore {
  cursor: pointer;
  rotate: 90deg;
}

.icon {
  opacity: 0;
  transform: scale(0.5);
}

.iconAnimate {
  animation: popIn 0.3s ease-out forwards;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  70% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes animation-completed {
  0% {
    opacity: 0;
  }
}
</style>
