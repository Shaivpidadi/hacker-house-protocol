"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState<"split" | "success">("split")

  const participants = [
    { name: "Me", amount: 250 },
    { name: "Yohan Markle", amount: 250 },
    { name: "Megan Luky", amount: 250 },
  ]

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 glass-card rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center glass">
              <CheckCircle className="text-primary-foreground w-6 h-6" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-4 text-foreground">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Your share has been paid. Your booking reservation will not be completed until all guests have paid their
            payment split.
          </p>

          <Link href="/">
            <Button className="w-full gradient-primary text-primary-foreground hover:opacity-90 py-3 glass">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/booking/${params.id}`}>
            <Button size="icon" variant="ghost" className="hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">ETH Global Buenos Aires - Private room Palermo</h1>
            <p className="text-muted-foreground">August 15-17</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-muted-foreground">Fra...</span>
            <span className="text-muted-foreground">Frame 45</span>
            <span className="text-muted-foreground">price</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground line-through">$500</span>
            <span className="text-2xl font-bold text-foreground">$440</span>
            <span className="text-muted-foreground">night</span>
            <span className="text-chart-2">★ 4.99 · 337 reviews</span>
          </div>
        </div>

        <Card className="mb-6 glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">CHECK-IN</p>
                <p className="font-medium text-foreground">5/6/2023</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CHECKOUT</p>
                <p className="font-medium text-foreground">2/11/2023</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">GUESTS</p>
              <p className="font-medium text-foreground">3 guests</p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Payment Split</h2>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-foreground">500 x 5 nights</span>
              <span className="font-semibold text-foreground">$2,500</span>
            </div>
          </div>

          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-primary rounded-full glass"></div>
                  <span className="text-foreground">{participant.name}</span>
                </div>
                <span className="font-semibold text-foreground">${participant.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
          <div className="max-w-md mx-auto">
            <Button
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-12 glass"
              onClick={() => setStep("success")}
            >
              Pay My Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
