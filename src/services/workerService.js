export const fetchWorkers = async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const response = await fetch("/data/workers.json")

    if (!response.ok) {
      throw new Error("Failed to load worker data")
    }

    const data = await response.json()

    return {
      success: true,
      workers: data.workers,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load worker data",
      workers: [],
    }
  }
}

export const fetchPayrollData = async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const workersResponse = await fetchWorkers()

    if (!workersResponse.success) {
      throw new Error("Failed to load worker data for payroll")
    }

    // Calculate payroll data based on workers
    const payrollData = workersResponse.workers.map((worker) => {
      // Simulate overtime calculation (random for demo)
      const overtime = Math.floor(Math.random() * 300)
      const total = worker.salary + overtime

      return {
        employeeId: worker.id,
        employee: worker.name,
        baseSalary: worker.salary,
        overtime: overtime,
        total: total,
        status: Math.random() > 0.5 ? "paid" : "pending",
        department: worker.department,
      }
    })

    return {
      success: true,
      payroll: payrollData,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load payroll data",
      payroll: [],
    }
  }
}

export const filterWorkersByDepartment = (workers, department) => {
  if (!department || department === "all" || department === "") {
    return workers
  }
  return workers.filter((worker) => worker.department.toLowerCase() === department.toLowerCase())
}
