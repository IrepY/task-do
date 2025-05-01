export const getDueDateColor = (dueDate) => {
  if (!dueDate) return "text-gray-400 dark:text-gray-500"
  const today = new Date()
  const due = new Date(dueDate)
  today.setHours(0,0,0,0)
  due.setHours(0,0,0,0)
  
  if (due < today) return "text-red-600 dark:text-red-400"
  if (due.getTime() === today.getTime()) return "text-yellow-600 dark:text-yellow-400"
  return "text-green-600 dark:text-green-400"
}