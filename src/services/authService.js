export const authenticateUser = async (email, password) => {
  try {
    // Simulate API delay (like real API)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Fetch from local JSON file
    const response = await fetch("/data/users.json")

    if (!response.ok) {
      throw new Error("Failed to load user data")
    }

    const data = await response.json()

    // Find user with matching email and password (regardless of userType)
    const user = data.users.find((u) => u.email === email && u.password === password)

    if (user) {
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType, // Return the user's registered type
          department: user.department || null,
        },
      }
    } else {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to connect to authentication server",
    }
  }
}
