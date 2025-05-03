import { useState } from "react"
import { useTranslation } from "react-i18next"

function TaskForm({ onAdd, onCancel, isSubmitting }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState("")
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim() === "") {
      setError(t('errors.emptyTitle'))
      return
    }
    await onAdd(title.trim(), description.trim(), dueDate)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow pb-20">
      {error && <p id="form-error" className="text-red-600 dark:text-red-400 text-sm mb-1 p-2 bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded">{error}</p>}
      <div className="flex flex-col">
         <label htmlFor="new-task-title" className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.title')}</label>
         <input
            id="new-task-title"
            type="text"
            placeholder={t('form.addDetails')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none transition disabled:opacity-70 dark:placeholder-gray-400"
            disabled={isSubmitting}
            aria-describedby={error ? 'form-error' : undefined}
         />
      </div>
      <div className="flex flex-col">
         <label htmlFor="new-task-description" className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.descriptionOptional')}</label>
         <textarea
            id="new-task-description"
            placeholder={t('form.whatToDo')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none transition disabled:opacity-70 resize-none dark:placeholder-gray-400"
            rows={4}
            disabled={isSubmitting}
         />
      </div>
      <div className="flex flex-col">
        <label htmlFor="new-task-due-date" className="text-sm mb-1 font-medium text-gray-700 dark:text-gray-300">{t('form.dueDate')}</label>
        <input
          id="new-task-due-date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none transition disabled:opacity-70"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <button
          type="submit"
          className={`bg-indigo-600 dark:bg-indigo-700 text-white font-semibold rounded-lg py-2 px-4 shadow hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-150 ease-in-out flex-grow ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('tasks.saving') : t('tasks.addTask')}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("")
            setDescription("")
            setDueDate("")
            onCancel()
          }}
          className={`bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg py-2 px-4 shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {t('tasks.cancel')}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
