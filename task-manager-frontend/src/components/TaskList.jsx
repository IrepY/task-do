import TaskItem from "./TaskItem"
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

function TaskList({ tasks, onDelete, onToggle, onTaskSelect, deletingTaskId, togglingTaskId, newlyAddedTaskId, isMenuOpen }) {
  const { t } = useTranslation()
  
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-400 dark:text-gray-500 mt-10 text-lg">
        {t('tasklist.noTask')}
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {tasks.map((task) => {
        const isBeingDeleted = deletingTaskId === task.id
        const isBeingToggled = togglingTaskId === task.id
        const isDisabled = isBeingDeleted || isBeingToggled
        const isNewlyAdded = newlyAddedTaskId === task.id

        return (
          <li key={task.id} className={`${isNewlyAdded ? 'animate-fadeInAndGrow' : ''}`}>
            <TaskItem
              task={task}
              onDelete={onDelete}
              onToggle={onToggle}
              onTaskSelect={onTaskSelect}
              isDeleting={isBeingDeleted}
              isDisabled={isDisabled}
              isMenuOpen={isMenuOpen}
            />
          </li>
        )
      })}
    </ul>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
  })).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTaskSelect: PropTypes.func.isRequired,
  deletingTaskId: PropTypes.number,
  togglingTaskId: PropTypes.number,
  newlyAddedTaskId: PropTypes.number,
  isMenuOpen: PropTypes.bool,
}

export default TaskList
