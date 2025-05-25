export const fetchBookings = async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const response = await fetch("/data/bookings.json")

    if (!response.ok) {
      throw new Error("Failed to load booking data")
    }

    const data = await response.json()

    return {
      success: true,
      bookings: data.bookings,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load booking data",
      bookings: [],
    }
  }
}

export const fetchBookingsByUser = async (userId) => {
  try {
    const result = await fetchBookings()

    if (!result.success) {
      throw new Error("Failed to load booking data")
    }

    // Filter bookings for specific user
    const userBookings = result.bookings.filter((booking) => booking.userId === Number.parseInt(userId))

    return {
      success: true,
      bookings: userBookings,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load user bookings",
      bookings: [],
    }
  }
}

export const getBookingById = async (bookingId) => {
  try {
    const result = await fetchBookings()

    if (!result.success) {
      throw new Error("Failed to load booking data")
    }

    const booking = result.bookings.find((booking) => booking.id === bookingId)

    return {
      success: true,
      booking: booking || null,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to find booking",
      booking: null,
    }
  }
}

export const filterBookingsByStatus = (bookings, status) => {
  if (!status || status === "all") {
    return bookings
  }
  return bookings.filter((booking) => booking.status === status)
}

export const filterBookingsByDateRange = (bookings, startDate, endDate) => {
  return bookings.filter((booking) => {
    const checkIn = new Date(booking.checkIn)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return checkIn >= start && checkIn <= end
  })
}

export const updateBookingStatus = async (bookingId, newStatus) => {
  // This would normally make an API call to update the booking
  // For now, we'll just simulate the operation
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      message: `Booking ${bookingId} status updated to ${newStatus}`,
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to update booking status",
    }
  }
}
