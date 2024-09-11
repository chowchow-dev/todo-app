<script setup>
import { ref, reactive } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onAddTask', 'onClose'])

const createTaskFormRef = ref()
const createTaskForm = reactive({
  title: '',
  desc: '',
  priority: '',
  color: 'rgba(255, 69, 0, 0.68)'
})

const validateTitle = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input the task title'))
  } else {
    callback()
  }
}

const validatePriority = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please select task priority'))
  } else {
    callback()
  }
}
const createTaskFormRules = reactive({
  title: [{ validator: validateTitle, trigger: 'blur' }],
  priority: [{ validator: validatePriority, trigger: 'blur' }]
})

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit('onAddTask', createTaskForm)
      emit('onClose')
    } else {
      console.log('error submit!')
    }
  })
}
</script>
<template>
  <el-dialog :model-value="visible" @close="emit('onClose')" title="Add new task" width="500">
    <el-form
      ref="createTaskFormRef"
      :model="createTaskForm"
      :rules="createTaskFormRules"
      label-width="auto"
      style="max-width: 600px"
      status-icon
    >
      <el-form-item label="Task name*" prop="title">
        <el-input v-model="createTaskForm.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Task description (optional)" prop="desc">
        <el-input v-model="createTaskForm.desc" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Priority*" prop="priority">
        <el-select v-model="createTaskForm.priority" placeholder="Please select a priority">
          <el-option label="Low" value="low" />
          <el-option label="Medium" value="medium" />
          <el-option label="High" value="high" />
        </el-select>
      </el-form-item>
      <el-form-item label="Color" prop="color">
        <el-color-picker v-model="createTaskForm.color" show-alpha />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('onClose')">Cancel</el-button>
      <el-button type="primary" @click="submitForm(createTaskFormRef)">Confirm</el-button>
    </template>
  </el-dialog>
</template>
<style module></style>
