import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TodoItem from '../TodoItem.vue'

describe('TodoItem', () => {
  const createWrapper = (props = {}) => {
    return mount(TodoItem, {
      props: {
        task: {
          id: 'task-1',
          title: 'Test Task',
          completed: false,
          ...props.task
        },
        dragId: 'task-1',
        isDragOver: false,
        isDragging: false,
        ...props
      }
    })
  }

  it('renders the task item correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('span').text()).toBe('Test Task')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(false)
  })

  it('emits "complete" event when clicking on an uncompleted task', async () => {
    const wrapper = createWrapper()
    await wrapper.find('li').trigger('click')
    expect(wrapper.emitted('complete')).toBeTruthy()
    expect(wrapper.emitted('complete')[0]).toEqual(['task-1'])
  })

  it('emits "reopen" event when clicking on a completed task', async () => {
    const wrapper = createWrapper({ task: { id: 'task-1', completed: true } })
    await wrapper.find('li').trigger('click')
    expect(wrapper.emitted('reopen')).toBeTruthy()
    expect(wrapper.emitted('reopen')[0]).toEqual(['task-1'])
  })

  it('emits "delete" event when clicking the delete button', async () => {
    const wrapper = createWrapper()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual(['task-1'])
  })

  it('emits drag events correctly', async () => {
    const wrapper = createWrapper()
    await wrapper.find('li').trigger('dragstart')
    expect(wrapper.emitted('dragstart')).toBeTruthy()
    expect(wrapper.emitted('dragstart')[0]).toEqual(['task-1'])

    await wrapper.find('li').trigger('dragover')
    expect(wrapper.emitted('dragover')).toBeTruthy()
    expect(wrapper.emitted('dragover')[0]).toEqual(['task-1'])

    await wrapper.find('li').trigger('dragend')
    expect(wrapper.emitted('dragend')).toBeTruthy()

    await wrapper.find('li').trigger('drop')
    expect(wrapper.emitted('drop')).toBeTruthy()
  })
})
