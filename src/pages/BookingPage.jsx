"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchRoomTypes } from "@/services/roomService"

const BookingPage = () => {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [roomType, setRoomType] = useState("")
  const [guests, setGuests] = useState("")
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [roomTypes, setRoomTypes] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)

  useEffect(() => {
    loadRoomTypes()
  }, [])

  const loadRoomTypes = async () => {
    setLoadingRooms(true)
    const result = await fetchRoomTypes()
    if (result.success) {
      setRoomTypes(result.roomTypes.filter((room) => room.available))
    }
    setLoadingRooms(false)
  }

  const handleBooking = (e) => {
    e.preventDefault()
    alert("Booking submitted successfully!")
  }

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Stay</CardTitle>
              <CardDescription>Reserve your perfect room at Grand Paradise Hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Room and Guests */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomType">Room Type</Label>
                    <select
                      id="roomType"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select room type</option>
                      {loadingRooms ? (
                        <option disabled>Loading rooms...</option>
                      ) : (
                        roomTypes.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} - {room.priceDisplay}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <select
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select guests</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Guest Information</h3>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={guestInfo.name}
                      onChange={(e) => handleGuestInfoChange("name", e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => handleGuestInfoChange("email", e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => handleGuestInfoChange("phone", e.target.value)}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Complete Booking
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
