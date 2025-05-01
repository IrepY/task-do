import React from "react"
import PropTypes from "prop-types"
import { useTranslation } from 'react-i18next'

function EditTaskForm({
  task,
  editTitle,
  editDescription,
  setEditTitle,
  setEditDescription,
  editDueDate,
  setEditDueDate,
  handleEditSubmit,
  cancelEdit,
  isSaving,
  error,
  showButtons = true
}) {

  const onSubmit = (e) => {
    e.preventDefault()
    handleEditSubmit(e, task)
  }

  const { t, i18n } = useTranslation()

  return (
    <form
      className="flex flex-col gap-3 w-full"
      onSubmit={onSubmit}
    >
      {error && <div className="text-red-600 text-sm mb-1 p-2 bg-red-50 border border-red-300 rounded">{error}</div>}

      <div className="flex flex-col">
        <label htmlFor={`edit-title-${task.id}`} className="text-sm mb-1 font-medium text-gray-700">{t('form.title')}</label>
        <input
          id={`edit-title-${task.id}`}
          className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition duration-150 ease-in-out"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          required
          disabled={isSaving}
          aria-describedby={error ? `edit-error-${task.id}` : undefined}
          placeholder={t('form.addDetails')}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={`edit-description-${task.id}`} className="text-sm mb-1 font-medium text-gray-700">{t('form.descriptionOptional')}</label>
        <textarea
          id={`edit-description-${task.id}`}
          className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition duration-150 ease-in-out resize-none"
          value={typeof editDescription === "string" ? editDescription : ""}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={3}
          disabled={isSaving}
          placeholder={t('form.whatToDo')}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={`edit-due-date-${task.id}`} className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">
          {t('form.dueDate')}
        </label>
        <input
          id={`edit-due-date-${task.id}`}
          type="date"
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition duration-150 ease-in-out dark:bg-gray-700 dark:text-white"
          value={editDueDate || ""}
          onChange={e => setEditDueDate(e.target.value)}
          disabled={isSaving}
          lang={t('dateLang') || undefined}
        />
        <div className="mt-1 px-1 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      {error && <span id={`edit-error-${task.id}`} className="sr-only">{error}</span>}
      
      {showButtons && (
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className={`bg-indigo-500 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-600 transition duration-150 ease-in-out ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? t('tasks.saving') : t('tasks.save')}
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className={`bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-300 transition duration-150 ease-in-out ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {t('tasks.cancel')}
          </button>
        </div>
      )}
    </form>
  )
}

EditTaskForm.propTypes = {
  task: PropTypes.object.isRequired,
  editTitle: PropTypes.string.isRequired,
  editDescription: PropTypes.string.isRequired,
  setEditTitle: PropTypes.func.isRequired,
  setEditDescription: PropTypes.func.isRequired,
  editDueDate: PropTypes.string,
  setEditDueDate: PropTypes.func,
  handleEditSubmit: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  error: PropTypes.string,
  showButtons: PropTypes.bool
}

export default EditTaskForm
