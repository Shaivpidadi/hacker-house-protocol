"use client"

import { useState } from "react"
import { PaymentSplit } from "./payment-split"
import { PaymentSuccess } from "./payment-success"

interface CheckoutFlowProps {
  propertyId: string
}

export function CheckoutFlow({ propertyId }: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = useState<"split" | "success">("split")

  const handlePaymentComplete = () => {
    setCurrentStep("success")
  }

  if (currentStep === "split") {
    return <PaymentSplit propertyId={propertyId} onPaymentComplete={handlePaymentComplete} />
  }

  return <PaymentSuccess />
}
