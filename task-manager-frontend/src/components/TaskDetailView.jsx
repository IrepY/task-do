import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import { getDueDateColor } from '../hooks/dateFormatters'

function TaskDetailView({ task, onClose, onEdit, onToggle, isSaving, isDesktop }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDueDate, setEditDueDate] = useState("")
  const [editError, setEditError] = useState("")
  const [isAnimatingToggle, setIsAnimatingToggle] = useState(false)
  const [visualCompleted, setVisualCompleted] = useState(task.completed)
  const { t } = useTranslation()

  const containerRef = useRef(null)

  const startEdit = useCallback(() => {
    if (!task) return
    setIsEditing(true)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditDueDate(task.due_date || "")
    setEditError("")
  }, [task])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditError("")
  }, [])

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault()
    setEditError("")

    if (!editTitle.trim()) {
      setEditError(t('errors.emptyTitle'))
      return
    }

    if (!task) return

    try {
      await onEdit(task.id, editTitle.trim(), editDescription.trim(), editDueDate || null)
      setIsEditing(false)
    } catch (error) {
      console.error(t('errors.editFailed'), error)
      setEditError(t('errors.saveFailed'))
    }
  }, [onEdit, task, editTitle, editDescription, editDueDate, t])

  const handleBackClick = useCallback(() => {
    if (isEditing) {
      cancelEdit()
      return
    }
    onClose()
  }, [isEditing, cancelEdit, onClose])

  useEffect(() => {
    if (!isAnimatingToggle) {
      setVisualCompleted(task.completed)
    }
  }, [task.completed, isAnimatingToggle])

  const handleToggle = useCallback((id, completed) => {
    if (isAnimatingToggle) return

    setIsAnimatingToggle(true)
    setVisualCompleted(completed)

    setTimeout(() => {
      onToggle(id, completed)

      setTimeout(() => {
        setIsAnimatingToggle(false);
      }, 100)
    }, 300)
  }, [onToggle, isAnimatingToggle])

  const ActionButtons = () => (
    <>
      {!isDesktop && (
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={isEditing ? 'edit-mode' : 'view-mode'}
            timeout={200}
            classNames="fade-buttons"
          >
            <div className="flex items-center gap-2 w-full">
              {!isEditing ? (
                <>
                  <SwitchTransition mode="out-in">
                    <CSSTransition
                      key={visualCompleted ? 'mark-pending' : 'mark-complete'}
                      timeout={400}
                      classNames="fade-buttons"
                    >
                      {!visualCompleted ? (
                        <button
                          onClick={() => handleToggle(task.id, true)}
                          className="bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500 px-4 py-2 rounded-lg font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 flex-1"
                          disabled={isAnimatingToggle}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{t('tasks.markComplete')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggle(task.id, false)}
                          className="bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded-lg font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 flex-1"
                          disabled={isAnimatingToggle}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 9 9 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{t('tasks.markPending')}</span>
                        </button>
                      )}
                    </CSSTransition>
                  </SwitchTransition>

                  <button
                    onClick={startEdit}
                    className="bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 flex-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>{t('tasks.edit')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditSubmit}
                    className="bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 flex-1"
                    disabled={isSaving}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{isSaving ? t('tasks.saving') : t('tasks.save')}</span>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded-lg font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 flex-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{t('tasks.cancel')}</span>
                  </button>
                </>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      )}

      {isDesktop && !isEditing && (
        <>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={visualCompleted ? 'mark-pending-desktop' : 'mark-complete-desktop'}
              timeout={400}
              classNames="fade-buttons"
            >
              {!visualCompleted ? (
                <button
                  onClick={() => handleToggle(task.id, true)}
                  className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-700 px-4 py-1.5 rounded font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1"
                  disabled={isAnimatingToggle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('tasks.markComplete')}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleToggle(task.id, false)}
                  className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-1.5 rounded font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1"
                  disabled={isAnimatingToggle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 9 9 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('tasks.markPending')}</span>
                </button>
              )}
            </CSSTransition>
          </SwitchTransition>

          <button
            onClick={startEdit}
            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-700 px-4 py-1.5 rounded font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>{t('tasks.edit')}</span>
          </button>
        </>
      )}
    </>
  )

  return (
    <div 
      ref={containerRef}
      className={`px-4 pt-4 sm:p-6 h-full flex flex-col relative transition-colors duration-300 ease-in-out ${task.completed ? 'bg-green-50 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} ${!isDesktop ? 'pb-20' : ''}`}
    >
      <div className="mb-4 flex justify-between items-center gap-2 flex-shrink-0">
        {isDesktop && (
          <div className="flex items-center w-full h-10">
            <div className="relative w-40 h-10 flex items-center">
              <button
                onClick={handleBackClick}
                className={`absolute inset-0 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center gap-1 px-3 py-1.5 h-10`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium w-16 inline-block">{t('tasks.back')}</span>
              </button>
            </div>
            <div className="flex-1 flex items-center h-10">
              <div className="w-full flex items-center justify-end">
                <SwitchTransition mode="out-in">
                  <CSSTransition
                    key={isEditing ? 'editing' : 'viewing'}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <div className="relative h-10 flex items-center w-full justify-end">
                      <div className="absolute inset-0 flex flex-row items-center gap-2 h-10 w-full justify-end">
                        {!isEditing && <ActionButtons />}
                      </div>
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            </div>
          </div>
        )}
        {!isDesktop && (
          <h2 className={`text-xl font-semibold text-gray-800 dark:text-gray-100 break-words whitespace-pre-line flex-1 min-w-0`}>
            {task.title}
          </h2>
        )}
        {!isDesktop && <div className="w-8 h-8 flex-shrink-0"></div>}
      </div>

      <div className="flex-grow overflow-y-auto relative">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={isEditing ? 'edit-mode' : 'view-mode'}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className="absolute inset-0 w-full">
              {isEditing ? (
                <form className="flex flex-col gap-3 w-full h-full" onSubmit={handleEditSubmit}>
                  {editError && <div className="text-red-600 dark:text-red-400 text-sm mb-1 p-2 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded">{editError}</div>}
                  <div className="flex flex-col">
                    <label htmlFor={`edit-title-${task.id}`} className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.title')}</label>
                    <input
                      id={`edit-title-${task.id}`}
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition duration-150 ease-in-out text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label htmlFor={`edit-description-${task.id}`} className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.description')}</label>
                    <textarea
                      id={`edit-description-${task.id}`}
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition duration-150 ease-in-out resize-none flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={5}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor={`edit-due-date-${task.id}`} className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.dueDate')}</label>
                    <input
                      id={`edit-due-date-${task.id}`}
                      type="date"
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition duration-150 ease-in-out bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={editDueDate || ""}
                      onChange={e => setEditDueDate(e.target.value)}
                      disabled={isSaving}
                      placeholder={t('form.dateFormat')}
                      title={t('form.dateFormat')}
                      lang={t('dateLang') || undefined}
                    />
                  </div>
                  
                  {isDesktop && (
                    <SwitchTransition mode="out-in">
                      <CSSTransition
                        key="edit-buttons-desktop"
                        timeout={200}
                        classNames="fade-buttons"
                      >
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            onClick={handleEditSubmit}
                            className={`bg-indigo-500 dark:bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition duration-150 ease-in-out ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSaving}
                          >
                            {isSaving ? t('tasks.saving') : t('tasks.save')}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className={`bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-150 ease-in-out ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSaving}
                          >
                            {t('tasks.cancel')}
                          </button>
                        </div>
                      </CSSTransition>
                    </SwitchTransition>
                  )}
                </form>
              ) : (
                <div className="sm:pb-0 h-full">
                  {isDesktop && (
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 break-words">
                      {task.title}
                    </h2>
                  )}
                  {task.description ? (
                    <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line break-words">
                      {task.description}
                    </p>
                  ) : (
                    <p className={`text-gray-400 dark:text-gray-500 italic ${isDesktop ? '' : 'mt-1'}`}>{t('tasks.noDescription')}</p>
                  )}
                  {task.due_date && (
                    <div className="mt-3 animate-fadeIn">
                      <span className={`font-medium ${getDueDateColor(task.due_date)}`}>
                        {t('form.dueDate') || "Due Date"}: {task.due_date}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>

      {!isDesktop && (
        <div className={`mt-auto flex-shrink-0 flex items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out ${task.completed ? 'bg-green-50 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}`}>
          <ActionButtons />
        </div>
      )}
    </div>
  )
}

TaskDetailView.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  isDesktop: PropTypes.bool.isRequired,
}

export default TaskDetailView
