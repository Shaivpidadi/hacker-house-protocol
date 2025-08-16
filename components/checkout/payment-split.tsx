"use client"

import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface PaymentSplitProps {
  propertyId: string
  onPaymentComplete: () => void
}

export function PaymentSplit({ propertyId, onPaymentComplete }: PaymentSplitProps) {
  const bookingDetails = {
    title: "ETH Global Buenos Aires - Private room Palermo",
    dates: "August 15-17",
    checkIn: "5/6/2023",
    checkOut: "2/11/2023",
    guests: 3,
    pricePerNight: 500,
    discountedPrice: 440,
    nights: 5,
    rating: 4.99,
    reviews: 337,
  }

  const totalCost = bookingDetails.pricePerNight * bookingDetails.nights
  const costPerPerson = totalCost / bookingDetails.guests

  const participants = [
    { name: "Me", amount: costPerPerson },
    { name: "Yohan Markle", amount: costPerPerson },
    { name: "Megan Luky", amount: costPerPerson },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4 h-1.5 bg-black rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Link href={`/booking/${propertyId}`}>
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-lg">{bookingDetails.title}</h1>
          <p className="text-sm text-gray-500">{bookingDetails.dates}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Property Summary */}
        <Card className="rounded-2xl shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fra... Frame 45</p>
                <p className="text-sm text-gray-600">price</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold">${bookingDetails.discountedPrice}</span>
                  <span className="text-sm text-gray-500 line-through">${bookingDetails.pricePerNight}</span>
                  <span className="text-sm text-gray-600">night</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {bookingDetails.rating} · {bookingDetails.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 mb-1">CHECK-IN</p>
                <p className="font-medium">{bookingDetails.checkIn}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">CHECKOUT</p>
                <p className="font-medium">{bookingDetails.checkOut}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">GUESTS</p>
                <p className="font-medium">{bookingDetails.guests} guests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Split */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Payment Split</h2>

          {/* Total Calculation */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
            <span className="font-medium">
              {bookingDetails.pricePerNight} x {bookingDetails.nights} nights
            </span>
            <span className="font-semibold text-lg">${totalCost.toLocaleString()}</span>
          </div>

          {/* Individual Splits */}
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <span className="font-medium">{participant.name}</span>
                </div>
                <span className="font-semibold">${participant.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <Button
          className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-base font-medium"
          onClick={onPaymentComplete}
        >
          Pay My Share
        </Button>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  )
}
