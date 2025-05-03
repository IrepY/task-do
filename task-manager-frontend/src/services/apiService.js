const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!response.ok) {
    const { detail } = await response.json().catch(() => ({}))
    throw new Error(detail || `HTTP error, status: ${response.status}`)
  }
  return response.status === 204 ? null : response.json()
}

const apiService = {
  getTasks: () => apiFetch(`${API_BASE_URL}/tasks`),
  addTask: (taskData) => apiFetch(`${API_BASE_URL}/tasks`, { method: "POST", body: JSON.stringify(taskData) }),
  updateTask: (id, updateData) => apiFetch(`${API_BASE_URL}/tasks/${id}`, { method: "PATCH", body: JSON.stringify(updateData) }),
  deleteTask: (id) => apiFetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" }),
}

export default apiService

