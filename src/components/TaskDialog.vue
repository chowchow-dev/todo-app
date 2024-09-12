<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['onSubmit', 'onClose'])

const createTaskFormRef = ref()
const createTaskForm = reactive({
  title: '',
  desc: '',
  priority: ''
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
      emit(
        'onSubmit',
        props.initialData ? { ...createTaskForm, id: props.initialData.id } : createTaskForm
      )
      formEl.resetFields()
    } else {
      // TODO: error handling
    }
  })
}

const handleClickCancel = (formEl) => {
  if (!formEl) return
  formEl.resetFields({
    title: '',
    desc: '',
    priority: ''
  })
  emit('onClose')
}

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      createTaskForm.title = props.initialData?.title
      createTaskForm.desc = props.initialData?.desc
      createTaskForm.priority = props.initialData?.priority
    } else {
      createTaskForm.title = ''
      createTaskForm.desc = ''
      createTaskForm.priority = ''
    }
  },
  { deep: true }
)
</script>
<template>
  <el-dialog
    :model-value="visible"
    destroy-on-close
    :before-close="
      (done) => {
        handleClickCancel(createTaskFormRef)
        done()
      }
    "
    title="Add new task"
    width="500"
  >
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
    </el-form>

    <template #footer>
      <el-button @click="handleClickCancel(createTaskFormRef)">Cancel</el-button>
      <el-button type="primary" @click="submitForm(createTaskFormRef)">Confirm</el-button>
    </template>
  </el-dialog>
</template>
<style module></style>
