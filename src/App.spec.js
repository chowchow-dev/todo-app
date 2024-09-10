import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import App from './App.vue'
import AddTodo from './components/AddTodo.vue'
import TodoItem from './components/TodoItem.vue'

// Mock the useLocalStorage composable
vi.mock('./composables/useLocalStorage', () => ({
  useLocalStorage: vi.fn(() => ({
    getLocalData: vi.fn(() => []),
    setLocalData: vi.fn()
  }))
}))

describe('App.vue', () => {
  afterEach(async () => {
    vi.clearAllMocks()
  })

  it('renders the title', () => {
    const wrapper = mount(App)
    expect(wrapper.find('h1').text()).toBe('📋 My tasks')
  })

  it('renders AddTodo component', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(AddTodo).exists()).toBe(true)
  })

  it('adds a new todo', async () => {
    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'New Task 1')
    wrapper.findComponent(AddTodo).vm.$emit('add', 'New Task 2')
    await flushPromises()
    expect(wrapper.vm.tasks).toHaveLength(2)

    const todos = wrapper.findAllComponents(TodoItem)
    expect(todos).toHaveLength(2)
    // Top todo should be New Task 2
    expect(todos[0].props('todo').title).toBe('New Task 2')
    // Bottom todo should be New Task 1
    expect(todos[1].props('todo').title).toBe('New Task 1')
  })

  it('completes a todo', async () => {
    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task to complete')
    await flushPromises()

    wrapper.findComponent(TodoItem).vm.$emit('complete', wrapper.vm.tasks[0].id)
    await flushPromises()

    expect(wrapper.vm.completedTasks).toHaveLength(1)
    expect(wrapper.vm.todoTasks).toHaveLength(0)
  })

  it('reopens a completed todo', async () => {
    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task to reopen')
    await flushPromises()

    wrapper.findComponent(TodoItem).vm.$emit('complete', wrapper.vm.tasks[0].id)
    await flushPromises()

    wrapper.findComponent(TodoItem).vm.$emit('reopen', wrapper.vm.tasks[0].id)
    await flushPromises()

    expect(wrapper.vm.completedTasks).toHaveLength(0)
    expect(wrapper.vm.todoTasks).toHaveLength(1)
  })

  it('deletes a todo', async () => {
    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task to delete')
    await flushPromises()
    expect(wrapper.vm.tasks).toHaveLength(1)

    wrapper.findComponent(TodoItem).vm.$emit('delete', wrapper.vm.tasks[0].id)
    await flushPromises()

    expect(wrapper.vm.tasks).toHaveLength(0)
  })

  it('loads tasks from local storage', async () => {
    const { useLocalStorage } = await import('./composables/useLocalStorage')
    const getLocalDataMock = vi.fn()
    vi.mocked(useLocalStorage).mockReturnValue({
      setLocalData: vi.fn(),
      getLocalData: getLocalDataMock,
      clearLocalData: vi.fn()
    })
    getLocalDataMock.mockReturnValue([
      { title: 'Task 1', completed: false },
      { title: 'Task 2', completed: true }
    ])

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.vm.tasks).toHaveLength(2)
  })

  it('syncs tasks to local storage when adding a new task', async () => {
    const { useLocalStorage } = await import('./composables/useLocalStorage')
    const setLocalDataMock = vi.fn()
    vi.mocked(useLocalStorage).mockReturnValue({
      setLocalData: setLocalDataMock,
      getLocalData: vi.fn(),
      clearLocalData: vi.fn()
    })

    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'New Task')
    await flushPromises()

    expect(setLocalDataMock).toHaveBeenCalledWith([
      expect.objectContaining({ title: 'New Task', completed: false })
    ])
  })

  it('syncs tasks to local storage when completing a task', async () => {
    const { useLocalStorage } = await import('./composables/useLocalStorage')
    const setLocalDataMock = vi.fn()
    vi.mocked(useLocalStorage).mockReturnValue({
      setLocalData: setLocalDataMock,
      getLocalData: vi.fn(),
      clearLocalData: vi.fn()
    })

    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task to complete')
    await flushPromises()

    wrapper.findComponent(TodoItem).vm.$emit('complete', wrapper.vm.tasks[0].id)
    await flushPromises()

    expect(setLocalDataMock).toHaveBeenCalledWith([
      expect.objectContaining({ title: 'Task to complete', completed: true })
    ])
  })

  it('reorders tasks within their respective sections', async () => {
    const wrapper = mount(App)
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task 1')
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task 2')
    wrapper.findComponent(AddTodo).vm.$emit('add', 'Task 3')
    await flushPromises()

    const todoItems = wrapper.findAllComponents(TodoItem)
    todoItems[1].vm.$emit('dragstart', 1, 'todo')
    todoItems[2].vm.$emit('dragover', 2, 'todo')
    todoItems[2].vm.$emit('drop')
    await flushPromises()

    const updatedTodoItems = wrapper.findAllComponents(TodoItem)
    expect(updatedTodoItems[0].props('todo').title).toBe('Task 3')
    expect(updatedTodoItems[1].props('todo').title).toBe('Task 1')
    expect(updatedTodoItems[2].props('todo').title).toBe('Task 2')

    // Complete a task
    wrapper.findComponent(TodoItem).vm.$emit('complete', wrapper.vm.tasks[0].id)
    await flushPromises()

    // Attempt to drag a completed task to the todo section (should not work)
    const completedItem = wrapper.findAllComponents(TodoItem).at(3)
    completedItem.vm.$emit('dragstart', 0, 'completed')
    todoItems[0].vm.$emit('dragover', 0, 'todo')
    todoItems[0].vm.$emit('drop')
    await flushPromises()

    expect(wrapper.vm.completedTasks).toHaveLength(1)
    expect(wrapper.vm.todoTasks).toHaveLength(2)
  })
})
