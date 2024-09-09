import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TodoItem from '../TodoItem.vue'

describe('TodoItem', () => {
  const createWrapper = (props = {}) => {
    return mount(TodoItem, {
      props: {
        todo: {
          id: 1,
          title: 'Test Todo',
          completed: false,
          ...props
        }
      }
    })
  }

  it('renders the todo item correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('span').text()).toBe('Test Todo')
    expect(wrapper.find('input[type="checkbox"]').element.checked).toBe(false)
  })

  it('emits "complete" event when clicking on an uncompleted todo', async () => {
    const wrapper = createWrapper()
    await wrapper.find('li').trigger('click')
    expect(wrapper.emitted('complete')).toBeTruthy()
    expect(wrapper.emitted('complete')[0]).toEqual([1])
  })

  it('emits "reopen" event when clicking on a completed todo', async () => {
    const wrapper = createWrapper({ completed: true })
    await wrapper.find('li').trigger('click')
    expect(wrapper.emitted('reopen')).toBeTruthy()
    expect(wrapper.emitted('reopen')[0]).toEqual([1])
  })

  it('emits "delete" event when clicking the delete button', async () => {
    const wrapper = createWrapper()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([1])
  })

  it('does not apply completed class when todo is not completed', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('li').classes()).not.toContain('completed')
  })
})
