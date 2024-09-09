import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AddTodo from '../AddTodo.vue'

describe('AddTodo', () => {
  const createWrapper = () => {
    return mount(AddTodo)
  }

  it('emits "add" event when submitting a new task', async () => {
    const wrapper = createWrapper()
    await wrapper.get('input[data-testid="new-task"]').setValue('Buy milk')
    expect(wrapper.get('input[data-testid="new-task"]').element.value).toBe('Buy milk')

    await wrapper.get('form[data-testid="add-todo-form"]').trigger('submit')
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual(['Buy milk'])
  })

  it('does not emit "add" event when submitting an empty task', async () => {
    const wrapper = createWrapper()
    await wrapper.get('input[data-testid="new-task"]').setValue('   ')
    await wrapper.get('form[data-testid="add-todo-form"]').trigger('submit')
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('clears input after submitting a valid task', async () => {
    const wrapper = createWrapper()
    await wrapper.get('input[data-testid="new-task"]').setValue('Buy groceries')
    await wrapper.get('form[data-testid="add-todo-form"]').trigger('submit')
    expect(wrapper.get('input[data-testid="new-task"]').element.value).toBe('')
  })
})
