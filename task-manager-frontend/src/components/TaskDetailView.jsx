import React, { useState, useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import { getDueDateColor } from '../hooks/dateFormatters'

const getBtnClass = (type, isDesktop, visualCompleted) => {
  const base = isDesktop
    ? "px-4 py-1.5 rounded font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1"
    : "px-4 py-2 rounded-lg font-semibold text-sm transition duration-150 ease-in-out flex items-center justify-center gap-1 flex-1";
  if (type === 'toggle') {
    return isDesktop
      ? `${base} ${visualCompleted
          ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-700"}`
      : `${base} ${visualCompleted
          ? "bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500"
          : "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500"}`;
  }
  if (type === 'edit') {
    return isDesktop
      ? `${base} bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-700`
      : `${base} bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500`;
  }
  return base;
};

function SaveCancelButtons({ isDesktop, isSaving, onEdit, onCancel, t }) {
  const iconClass = isDesktop ? "h-4 w-4" : "h-5 w-5";
  const disabledClass = isSaving ? ' opacity-50 cursor-not-allowed' : '';
  const btnClass = getBtnClass('', isDesktop);

  const config = [
    {
      key: 'save',
      onClick: onEdit,
      bg: 'bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500',
      iconD: "M5 13l4 4L19 7",
      label: isSaving ? t('tasks.saving') : t('tasks.save')
    },
    {
      key: 'cancel',
      onClick: onCancel,
      bg: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500',
      iconD: "M6 18L18 6M6 6l12 12",
      label: t('tasks.cancel')
    }
  ];

  return (
    <div className={`flex gap-2 mt-2${isDesktop ? '' : ' w-full'}`}>
      {config.map(({ key, onClick, bg, iconD, label }) =>
        <button
          key={key}
          type="button"
          onClick={onClick}
          className={`${btnClass} ${bg}${disabledClass}`}
          disabled={isSaving}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconD} />
          </svg>
          <span>{label}</span>
        </button>
      )}
    </div>
  );
}

function ActionButtons({
  isDesktop, isEditing, visualCompleted, isAnimatingToggle, isSaving,
  onToggle, onEdit, onCancel, onStartEdit, task, t
}) {
  if (!task) return null
  if (isEditing) return <SaveCancelButtons isDesktop={isDesktop} isSaving={isSaving} onEdit={onEdit} onCancel={onCancel} t={t} />;
  const iconClass = isDesktop ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className={`flex items-center gap-2 ${isDesktop ? '' : 'w-full'}`}>
      <button
        onClick={() => onToggle(task.id, !visualCompleted)}
        className={getBtnClass('toggle', isDesktop, visualCompleted)}
        disabled={isAnimatingToggle}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {visualCompleted
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          }
        </svg>
        <span>{visualCompleted ? t('tasks.markPending') : t('tasks.markComplete')}</span>
      </button>
      <button
        onClick={onStartEdit}
        className={getBtnClass('edit', isDesktop)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span>{t('tasks.edit')}</span>
      </button>
    </div>
  )
}

function TaskDetailView({ task, onClose, onEdit, onToggle, isSaving, isDesktop }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDueDate, setEditDueDate] = useState("")
  const [editError, setEditError] = useState("")
  const [isAnimatingToggle, setIsAnimatingToggle] = useState(false)
  const [visualCompleted, setVisualCompleted] = useState(task.completed)
  const { t } = useTranslation()

  const startEdit = () => {
    setIsEditing(true)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditDueDate(task.due_date || "")
  }

  const handleEditSubmit = async (e) => {
    if (e) e.preventDefault()
    setEditError("")
    if (!editTitle.trim()) {
      setEditError(t('errors.emptyTitle'))
      return
    }
    try {
      await onEdit(task.id, editTitle.trim(), editDescription.trim(), editDueDate || null)
      setIsEditing(false)
    } catch {
      setEditError(t('errors.saveFailed'))
    }
  }

  const handleCancelEdit = () => setIsEditing(false)

  const handleBackClick = () => {
    if (isEditing) {
      setIsEditing(false)
      return
    }
    onClose()
  }

  useEffect(() => {
    if (!isAnimatingToggle) setVisualCompleted(task.completed)
  }, [task.completed, isAnimatingToggle])

  const handleToggle = (id, completed) => {
    if (isAnimatingToggle) return
    setIsAnimatingToggle(true)
    setVisualCompleted(completed)
    onToggle(id, completed)
    setTimeout(() => setIsAnimatingToggle(false), 400)
  }

  return (
    <div
      className="px-4 pt-4 sm:p-6 h-full flex flex-col relative transition-colors duration-300 ease-in-out bg-gray-50 dark:bg-gray-900"
      style={{ flex: '1 1 0%' }}
    >
      <div className="mb-4 flex justify-between items-center gap-2 flex-shrink-0">
        {isDesktop ? (
          <div className="flex items-center w-full h-10">
            <div className="relative w-40 h-10 flex items-center">
              <button
                onClick={handleBackClick}
                className="absolute inset-0 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center gap-1 px-3 py-1.5 h-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium w-16 inline-block">{t('tasks.back')}</span>
              </button>
            </div>
            <div className="flex-1 flex items-center h-10">
              <div className="w-full flex items-center justify-end">
                <ActionButtons
                  isDesktop={isDesktop}
                  isEditing={isEditing}
                  visualCompleted={visualCompleted}
                  isAnimatingToggle={isAnimatingToggle}
                  isSaving={isSaving}
                  onToggle={handleToggle}
                  onEdit={handleEditSubmit}
                  onCancel={handleCancelEdit}
                  onStartEdit={startEdit}
                  task={task}
                  t={t}
                />
              </div>
            </div>
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 break-words whitespace-pre-line flex-1 min-w-0">
            {task.title}
          </h2>
        )}
      </div>

      <div className="flex-grow relative">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={isEditing ? 'edit-mode' : 'view-mode'}
            timeout={300}
            classNames="fade"
          >
            <div>
              {isEditing ? (
                <form className="flex flex-col gap-3 w-full h-full" onSubmit={handleEditSubmit}>
                  {editError && <div className="text-red-600 dark:text-red-400 text-sm mb-1 p-2 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded">{editError}</div>}
                  <div className="flex flex-col">
                    <label htmlFor={`edit-title-${task.id}`} className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.title')}</label>
                    <input
                      id={`edit-title-${task.id}`}
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition duration-150 ease-in-out text-lg font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor={`edit-description-${task.id}`} className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.description')}</label>
                    <textarea
                      id={`edit-description-${task.id}`}
                      className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none transition duration-150 ease-in-out resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
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
                      value={editDueDate}
                      onChange={e => setEditDueDate(e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </form>
              ) : (
                <div>
                  {isDesktop && (
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 break-words">
                      {task.title}
                    </h2>
                  )}
                  <p
                    className={`break-words ${
                      task.description
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500 italic mt-2"
                    }`}
                  >
                    {task.description || t('tasks.noDescription')}
                  </p>
                  {task.due_date && (
                    <div className="mt-2 animate-fadeIn">
                      <span className={`font-medium ${getDueDateColor(task.due_date)}`}>
                        {t('form.dueDate')}: {task.due_date}
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
        <div className="transition-colors duration-300 ease-in-out bg-gray-50 dark:bg-gray-900">
          <ActionButtons
            isDesktop={isDesktop}
            isEditing={isEditing}
            visualCompleted={visualCompleted}
            isAnimatingToggle={isAnimatingToggle}
            isSaving={isSaving}
            onToggle={handleToggle}
            onEdit={handleEditSubmit}
            onCancel={handleCancelEdit}
            onStartEdit={startEdit}
            task={task}
            t={t}
          />
        </div>
      )}
    </div>
  )
}

export default TaskDetailView