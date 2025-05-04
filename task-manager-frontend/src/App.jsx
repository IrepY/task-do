import { useEffect, useState, useCallback } from "react"
import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group'
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import TaskDetailView from "./components/TaskDetailView"
import MenuPanel from "./components/MenuPanel"
import apiService from "./services/apiService"
import ProfileView from "./components/ProfileView"
import SettingsView from "./components/SettingsView"
import AboutView from "./components/AboutView"
import useMediaQuery from "./hooks/useMediaQuery"
import './transitions.css'
import { useTranslation } from "react-i18next"

const VIEW_TRANSITION_DURATION = 300;
const BUTTON_TRANSITION_DURATION = 200;
const DELETE_ANIMATION_DURATION = 300;

const getTitleForView = (view, isDesktop, t) =>
  ({
    list: isDesktop ? t('tasks.title') : t('menu.list'),
    add: t('tasks.newTask'),
    detail: t('tasks.title'),
    profile: t('menu.profile'),
    settings: t('menu.settings'),
    about: t('menu.about'),
  }[view] || 'Task-Do')

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submittingTask, setSubmittingTask] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [togglingTaskId, setTogglingTaskId] = useState(null)
  const [editingTaskIdOp, setEditingTaskIdOp] = useState(null)
  const [newlyAddedTaskId, setNewlyAddedTaskId] = useState(null)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState('list')

  const isDesktop = useMediaQuery('(min-width: 768px)')

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load tasks. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleTaskSelect = useCallback((taskId) => {
    setSelectedTaskId(taskId)
    setActiveView('detail')
  }, [])

  const handleCloseTaskDetail = useCallback(() => {
    setSelectedTaskId(null)
    setActiveView('list')
  }, [])

  const handleShowAddTask = useCallback(() => {
    setSelectedTaskId(null)
    setActiveView('add')
  }, [])

  const handleHideAddTask = useCallback(() => {
    setActiveView('list')
  }, [])

  const closeMenu = useCallback(() => {
    if (!isDesktop) {
      setIsMenuOpen(false)
    }
  }, [isDesktop])

  const handleMenuItemSelect = useCallback((itemKey) => {
    setSelectedTaskId(null)
    setActiveView(itemKey)
    if (!isDesktop) {
      closeMenu()
    }
  }, [closeMenu, isDesktop]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleGoHome = useCallback(() => {
    setSelectedTaskId(null)
    setActiveView('list')
  }, [])

  const addTask = async (title, description, due_date) => {
    setSubmittingTask(true)
    setError(null)
    setNewlyAddedTaskId(null)
    try {
      const newTask = await apiService.addTask({ title, description, due_date })
      setTasks((prevTasks) => [...prevTasks, newTask])
      setNewlyAddedTaskId(newTask.id)
      setActiveView('list')

      setTimeout(() => {
        setNewlyAddedTaskId(null)
      }, 500)
    } catch (err) {
      setError(err.message || "Failed to add task. Please try again.")
    } finally {
      setSubmittingTask(false)
    }
  }

  const deleteTask = useCallback(async (id) => {
    if (pendingDeleteId === id || deletingTaskId === id) return

    const originalTasks = [...tasks]
    setDeletingTaskId(id)
    setPendingDeleteId(id)
    setError(null)

    if (selectedTaskId === id) {
      setSelectedTaskId(null)
      setActiveView('list')
    }

    setTimeout(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
      setDeletingTaskId(null)

      apiService.deleteTask(id)
        .catch((err) => {
          console.error("Failed to delete task:", err)
          setError(err.message || "Failed to delete task. Reverting changes.")
          setTasks(originalTasks)
        })
        .finally(() => {
          setPendingDeleteId((currentPendingId) => (currentPendingId === id ? null : currentPendingId))
        });
    }, DELETE_ANIMATION_DURATION)

  }, [tasks, selectedTaskId, pendingDeleteId, deletingTaskId])

  const toggleTask = async (id, completed) => {
    if (togglingTaskId) return

    const originalTasks = [...tasks]
    setTogglingTaskId(id)
    setError(null)

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed } : task
      )
    )

    try {
      await apiService.updateTask(id, { completed })
    } catch (err) {
      setError(err.message || "Failed to update task status.")
      setTasks(originalTasks)
    } finally {
      setTogglingTaskId(null)
    }
  }

  const editTask = async (id, title, description, due_date) => {
    if (editingTaskIdOp) return;

    const originalTasks = [...tasks]
    setEditingTaskIdOp(id)
    setError(null)

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title, description, due_date } : task
      )
    )

    try {
      const updatedTask = await apiService.updateTask(id, { title, description, due_date });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      )
    } catch (err) {
      setError(err.message || "Failed to edit task.")
      setTasks(originalTasks)
    } finally {
      setEditingTaskIdOp(null)
    }
  }

  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null
  const isSelectedTaskSaving = editingTaskIdOp === selectedTaskId

  const { t } = useTranslation()
  const currentTitle = getTitleForView(activeView, isDesktop, t);
  const currentViewKey = activeView === 'detail' ? `detail-${selectedTaskId}` : activeView

  return (
    <div className="relative min-h-screen">
      {/* Animated background gradient */}
      <div
        className={`
          fixed inset-0 -z-10
          animate-gradient-bg
        `}
        aria-hidden="true"
      />
      <div className="app-fade-root min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex ${isDesktop ? 'flex-row h-[600px]' : 'flex-col h-[90vh] sm:h-[95vh]'} overflow-hidden relative`}>

            {isDesktop && (
              <>
                <MenuPanel
                  isOpen={isMenuOpen}
                  onClose={toggleMenu}
                  selectedItem={activeView}
                  onSelectItem={handleMenuItemSelect}
                  isDesktop={isDesktop}
                />

                <div className="flex-grow bg-gray-50 dark:bg-gray-800 p-0 flex flex-col relative">
                  <div className="p-4 sm:p-6 flex justify-between items-center mb-0 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <button
                      onClick={toggleMenu}
                      className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 p-2 -ml-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out"
                      aria-label={isMenuOpen ? t('menu.collapse') : t('menu.expand')}
                      title={isMenuOpen ? t('menu.collapse') : t('menu.expand')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg"
                          className={`h-6 w-6 transition-all duration-300 ease-out ${isMenuOpen ? 'rotate-90 text-indigo-800 dark:text-indigo-100' : 'text-indigo-600 dark:text-indigo-300'}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center truncate px-4 flex-grow">
                      {currentTitle}
                    </h1>
                    <div className="w-6 h-6"></div>
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-6 mb-0 flex-shrink-0" role="alert">
                      <strong className="font-bold">{t('tasks.error')}</strong>
                      <span className="block sm:inline"> {error}</span>
                    </div>
                  )}

                  <div className={`flex-grow relative overflow-hidden`}>
                    {loading && activeView === 'list' ? (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 p-6">
                        {t('tasks.loading')}
                      </div>
                    ) : (
                      <div className={`absolute inset-0 overflow-y-auto`}>
                        <TransitionGroup component={null}>
                          <CSSTransition
                            key={currentViewKey}
                            timeout={VIEW_TRANSITION_DURATION}
                            classNames="fade"
                            unmountOnExit
                          >
                            <div className="absolute inset-0">
                              {(activeView === 'list') && (
                                <div className={`flex flex-col h-full bg-white dark:bg-gray-900`}>
                                  <div className="flex justify-end items-center mb-0 mr-4 sm:mr-6 py-4 sm:py-6 flex-shrink-0">
                                    <button
                                      onClick={handleShowAddTask}
                                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800 px-4 py-1.5 rounded font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1"
                                      aria-label={t('tasks.newTask')}
                                      title={t('tasks.newTask')}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                      </svg>
                                      <span>{t('tasks.newTask')}</span>
                                    </button>
                                  </div>
                                  <div
                                    className={`flex-grow overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6`}
                                    style={{ scrollbarGutter: 'stable' }}
                                  >
                                    <TaskList
                                      tasks={tasks}
                                      onDelete={deleteTask}
                                      onToggle={toggleTask}
                                      onTaskSelect={handleTaskSelect}
                                      deletingTaskId={deletingTaskId}
                                      togglingTaskId={togglingTaskId}
                                      newlyAddedTaskId={newlyAddedTaskId}
                                      isMenuOpen={isMenuOpen ? isMenuOpen : undefined}
                                    />
                                  </div>
                                </div>
                              )}
                              {(activeView === 'detail' && selectedTask) && (
                                <div className={`h-full bg-white dark:bg-gray-900`}>
                                  <TaskDetailView
                                    task={selectedTask}
                                    onClose={handleCloseTaskDetail}
                                    onEdit={editTask}
                                    onToggle={toggleTask}
                                    isSaving={isSelectedTaskSaving}
                                    isDesktop={isDesktop}
                                  />
                                </div>
                              )}
                              {(activeView === 'add') && (
                                <div className={`p-4 sm:p-6 h-full flex flex-col bg-white dark:bg-gray-900`}>
                                  <TaskForm
                                    onAdd={addTask}
                                    onCancel={handleHideAddTask}
                                    isSubmitting={submittingTask}
                                    isDesktop={isDesktop}
                                  />
                                </div>
                              )}
                              {(activeView === 'profile') && (
                                <div className={`h-full bg-white dark:bg-gray-900 p-4 sm:p-6`}>
                                  <ProfileView isDesktop={isDesktop} />
                                </div>
                              )}
                              {(activeView === 'settings') && (
                                <div className={`h-full bg-white dark:bg-gray-900 p-4 sm:p-6`}>
                                  <SettingsView isDesktop={isDesktop} />
                                </div>
                              )}
                              {(activeView === 'about') && (
                                <div className={`h-full bg-white dark:bg-gray-900 p-4 sm:p-6`}>
                                  <AboutView isDesktop={isDesktop} />
                                </div>
                              )}
                            </div>
                          </CSSTransition>
                        </TransitionGroup>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!isDesktop && (
              <>
                <div className={`w-full flex-shrink-0 bg-gradient-to-b from-indigo-500 to-indigo-400 dark:from-gray-900 dark:to-gray-800 text-white flex flex-col justify-center p-4 py-4 relative shadow-md`}>
                  <div className={`relative h-8 text-center`}>
                    <SwitchTransition mode="out-in">
                      <CSSTransition
                        key={currentTitle}
                        timeout={VIEW_TRANSITION_DURATION}
                        classNames="fade"
                      >
                        <h1 className={`absolute inset-0 text-xl font-bold tracking-tight truncate px-2`}>
                          {currentTitle}
                        </h1>
                      </CSSTransition>
                    </SwitchTransition>
                  </div>
                </div>

                <div className="w-full flex-grow bg-gray-50 dark:bg-gray-800 p-0 flex flex-col relative">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4 mb-0 flex-shrink-0" role="alert">
                      <strong className="font-bold">{t('tasks.error')}</strong>
                      <span className="block sm:inline"> {error}</span>
                    </div>
                  )}
                  <div className={`flex-grow relative overflow-hidden`}>
                    {loading && activeView === 'list' ? (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 p-6">
                        {t('tasks.loading')}
                      </div>
                    ) : (
                      <TransitionGroup component={null}>
                        <CSSTransition
                          key={currentViewKey}
                          timeout={VIEW_TRANSITION_DURATION}
                          classNames="fade"
                          unmountOnExit
                        >
                          <div className="absolute inset-0">
                            {(activeView === 'list') && (
                              <div className={`flex flex-col h-full bg-white dark:bg-gray-900`}>
                                <div
                                  className={`flex-grow overflow-y-auto px-4 pt-4 pb-20`}
                                  style={{ scrollbarGutter: 'stable' }}
                                >
                                  <TaskList
                                    tasks={tasks}
                                    onDelete={deleteTask}
                                    onToggle={toggleTask}
                                    onTaskSelect={handleTaskSelect}
                                    deletingTaskId={deletingTaskId}
                                    togglingTaskId={togglingTaskId}
                                    newlyAddedTaskId={newlyAddedTaskId}
                                    isMenuOpen={false ? false : undefined}
                                  />
                                </div>
                              </div>
                            )}
                            {(activeView === 'detail' && selectedTask) && (
                              <div className={`h-full bg-white dark:bg-gray-900 overflow-y-auto pb-20`}>
                                <TaskDetailView
                                  task={selectedTask}
                                  onClose={handleCloseTaskDetail}
                                  onEdit={editTask}
                                  onToggle={toggleTask}
                                  isSaving={isSelectedTaskSaving}
                                  isDesktop={isDesktop}
                                />
                              </div>
                            )}
                            {(activeView === 'add') && (
                              <div className={`p-4 sm:p-6 h-full flex flex-col bg-white dark:bg-gray-900 overflow-y-auto pb-20`}>
                                <TaskForm
                                  onAdd={addTask}
                                  onCancel={handleHideAddTask}
                                  isSubmitting={submittingTask}
                                  isDesktop={isDesktop}
                                />
                              </div>
                            )}
                            {(activeView === 'profile') && (
                              <div className={`h-full bg-white dark:bg-gray-900 p-4 sm:p-6 overflow-y-auto pb-20`}>
                                <ProfileView isDesktop={isDesktop} />
                              </div>
                            )}
                            {(activeView === 'settings') && (
                              <div className={`h-full bg-white dark:bg-gray-900 p-4 sm:p-6 overflow-y-auto pb-20`}>
                                <SettingsView isDesktop={isDesktop} />
                              </div>
                            )}
                            {(activeView === 'about') && (
                              <div className={`h-full bg-white dark:bg-gray-900 p-4 sm:p-6 overflow-y-auto pb-20`}>
                                <AboutView isDesktop={isDesktop} />
                              </div>
                            )}
                          </div>
                        </CSSTransition>
                      </TransitionGroup>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-10 shadow-top">
                    <button
                      onClick={toggleMenu}
                      aria-label={t('menu.open')}
                      title={t('menu.open')}
                      className="text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-800 rounded-full p-3 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>

                    <div className="flex-1 flex justify-center">
                      <SwitchTransition mode="out-in">
                        <CSSTransition
                          key={activeView !== 'list' ? 'show-home' : 'hide-home'}
                          timeout={BUTTON_TRANSITION_DURATION}
                          classNames="fade-buttons"
                        >
                          <div>
                            {activeView !== 'list' ? (
                              <button
                                onClick={handleGoHome}
                                aria-label={t('menu.home')}
                                title={t('menu.home')}
                                className="text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-800 rounded-full p-3 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </button>
                            ) : <div className="w-12 h-12"></div> }
                          </div>
                        </CSSTransition>
                      </SwitchTransition>
                    </div>

                    <SwitchTransition mode="out-in">
                      <CSSTransition
                        key={activeView !== 'add' ? 'show-add' : 'hide-add'}
                        timeout={BUTTON_TRANSITION_DURATION}
                        classNames="fade-buttons"
                      >
                        <div>
                          {activeView !== 'add' ? (
                            <button
                              onClick={handleShowAddTask}
                              aria-label={t('tasks.newTask')}
                              title={t('tasks.newTask')}
                              className="text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-800 rounded-full p-3 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          ) : <div className="w-12 h-12"></div> }
                        </div>
                      </CSSTransition>
                    </SwitchTransition>
                  </div>
                </div>

                <MenuPanel
                  isOpen={isMenuOpen}
                  onClose={closeMenu}
                  selectedItem={activeView}
                  onSelectItem={handleMenuItemSelect}
                  isDesktop={isDesktop}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
