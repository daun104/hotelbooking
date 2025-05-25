export const fetchCleaningTasks = async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const response = await fetch("/data/cleaning.json")

    if (!response.ok) {
      throw new Error("Failed to load cleaning data")
    }

    const data = await response.json()

    return {
      success: true,
      tasks: data.cleaningTasks,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load cleaning data",
      tasks: [],
    }
  }
}

export const getTaskById = async (taskId) => {
  try {
    const result = await fetchCleaningTasks()

    if (!result.success) {
      throw new Error("Failed to load cleaning data")
    }

    const task = result.tasks.find((task) => task.id === taskId)

    return {
      success: true,
      task: task || null,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to find cleaning task",
      task: null,
    }
  }
}

export const filterTasksByRoom = (tasks, room) => {
  if (!room || room === "all" || room === "") {
    return tasks
  }
  return tasks.filter((task) => task.room.toLowerCase().includes(room.toLowerCase()))
}

export const filterTasksByStatus = (tasks, status) => {
  if (!status || status === "all") {
    return tasks
  }
  return tasks.filter((task) => task.status === status)
}

export const filterTasksByAssignee = (tasks, assigneeId) => {
  if (!assigneeId || assigneeId === "all") {
    return tasks
  }
  return tasks.filter((task) => task.assignedId === Number.parseInt(assigneeId))
}

export const updateTaskStatus = async (taskId, newStatus) => {
  // This would normally make an API call to update the task
  // For now, we'll just simulate the operation
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      message: `Task ${taskId} status updated to ${newStatus}`,
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to update task status",
    }
  }
}

export const getTasksByDate = async (date) => {
  try {
    const result = await fetchCleaningTasks()

    if (!result.success) {
      throw new Error("Failed to load cleaning data")
    }

    const tasksForDate = result.tasks.filter((task) => task.date === date)

    return {
      success: true,
      tasks: tasksForDate,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load tasks for date",
      tasks: [],
    }
  }
}
