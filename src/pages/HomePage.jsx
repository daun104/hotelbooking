"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, Car, Coffee, Dumbbell, Waves } from "lucide-react"
import { fetchRoomTypes } from "@/services/roomService"

const HomePage = () => {
  const navigate = useNavigate()
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const amenities = [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Car, name: "Free Parking" },
    { icon: Coffee, name: "Restaurant" },
    { icon: Dumbbell, name: "Fitness Center" },
    { icon: Waves, name: "Swimming Pool" },
  ]

  // Load room types when component mounts
  useEffect(() => {
    loadRoomTypes()
  }, [])

  const loadRoomTypes = async () => {
    setLoading(true)
    setError("")

    const result = await fetchRoomTypes()

    if (result.success) {
      setRoomTypes(result.roomTypes)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Grand Paradise Hotel</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/booking")}>Book Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h2 className="text-5xl font-bold mb-4">Welcome to Paradise</h2>
            <p className="text-xl mb-6">
              Experience luxury and comfort in our world-class hotel with stunning ocean views
            </p>
            <div className="flex items-center text-lg">
              <MapPin className="mr-2" />
              <span>123 Paradise Beach, Tropical Island</span>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Our Rooms</h3>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {roomTypes.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Room Image</span>
                    {!room.available && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive">Unavailable</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <div>
                        <div>{room.name}</div>
                        <div className="text-sm text-gray-500 font-normal">
                          {room.size} • {room.bedType}
                        </div>
                      </div>
                      <Badge variant="secondary">{room.priceDisplay}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {room.capacity} • {room.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Features */}
                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-1">Features:</div>
                        <ul className="text-xs space-y-1">
                          {room.features.slice(0, 2).map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full" onClick={() => navigate("/booking")} disabled={!room.available}>
                        {room.available ? "Book This Room" : "Currently Unavailable"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Retry Button */}
          {error && !loading && (
            <div className="text-center mt-6">
              <Button onClick={loadRoomTypes} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Hotel Amenities</h3>
          <div className="grid md:grid-cols-5 gap-8">
            {amenities.map((amenity) => (
              <div key={amenity.name} className="text-center">
                <amenity.icon className="mx-auto h-12 w-12 mb-4 text-primary" />
                <p className="font-medium">{amenity.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Surroundings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Explore the Area</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2">Private Beach</h4>
                <p>Crystal clear waters just steps away</p>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2">City Center</h4>
                <p>Shopping and dining within 10 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Grand Paradise Hotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
