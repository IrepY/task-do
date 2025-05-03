import TaskItem from "./TaskItem"
import { useTranslation } from 'react-i18next'

function TaskList({ tasks, onDelete, onToggle, onTaskSelect, deletingTaskId, togglingTaskId, newlyAddedTaskId }) {
  const { t } = useTranslation()
  
  return tasks.length === 0 ? (
    <div className="text-center text-gray-400 dark:text-gray-500 mt-10 text-lg">
      {t('tasklist.noTask')}
    </div>
  ) : (
    <ul className="flex flex-col">
      {tasks.map(task => (
        <li
          key={task.id}
          className={newlyAddedTaskId === task.id && 'animate-fadeInAndGrow'}
        >
          <TaskItem
            task={task}
            onDelete={onDelete}
            onToggle={onToggle}
            onTaskSelect={onTaskSelect}
            isDeleting={deletingTaskId === task.id}
            isDisabled={deletingTaskId === task.id || togglingTaskId === task.id}
          />
        </li>
      ))}
    </ul>
  )
}

export default TaskList
