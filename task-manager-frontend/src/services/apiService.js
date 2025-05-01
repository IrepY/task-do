const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000" 

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error, status: ${response.status}`
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage
    } catch (e) {}
    throw new Error(errorMessage)
  }
  // Ezt a DELETE-hez
  if (response.status === 204) {
    return null
  }
  return response.json()
}

const apiFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    return handleResponse(response)
  } catch (error) {
    console.error("API Fetch Error:", error.message)
    console.error("Failed URL:", url)
    console.error("Fetch Options:", defaultOptions)
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}

const apiService = {
  getTasks: () => {
    return apiFetch(`${API_BASE_URL}/tasks`)
  },

  addTask: (taskData) => {
    return apiFetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  },

  updateTask: (id, updateData) => {
    return apiFetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    })
  },

  deleteTask: (id) => {
    return apiFetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    })
  },
}

export default apiService

