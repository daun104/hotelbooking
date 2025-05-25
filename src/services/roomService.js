export const fetchRoomTypes = async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const response = await fetch("/data/rooms.json")

    if (!response.ok) {
      throw new Error("Failed to load room data")
    }

    const data = await response.json()

    return {
      success: true,
      roomTypes: data.roomTypes,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load room data",
      roomTypes: [],
    }
  }
}

export const getRoomById = async (roomId) => {
  try {
    const result = await fetchRoomTypes()

    if (!result.success) {
      throw new Error("Failed to load room data")
    }

    const room = result.roomTypes.find((room) => room.id === Number.parseInt(roomId))

    return {
      success: true,
      room: room || null,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to find room",
      room: null,
    }
  }
}

export const getAvailableRooms = async () => {
  try {
    const result = await fetchRoomTypes()

    if (!result.success) {
      throw new Error("Failed to load room data")
    }

    const availableRooms = result.roomTypes.filter((room) => room.available)

    return {
      success: true,
      roomTypes: availableRooms,
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to load available rooms",
      roomTypes: [],
    }
  }
}

export const filterRoomsByPrice = (rooms, maxPrice) => {
  return rooms.filter((room) => room.price <= maxPrice)
}

export const filterRoomsByCapacity = (rooms, minGuests) => {
  return rooms.filter((room) => room.maxGuests >= minGuests)
}
