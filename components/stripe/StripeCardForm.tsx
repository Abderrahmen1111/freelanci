"use client"

"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

function InnerCardForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!stripe || !elements) return
    setLoading(true)
    const { error } = await stripe.confirmPayment({ elements, redirect: "if_required" })
    if (error) {
      alert(error.message)
    } else {
      alert("Paiement confirmé")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <PaymentElement />
      <Button className="w-full" disabled={!stripe || !elements || loading} onClick={handleSubmit}>
        {loading ? "Paiement..." : "Payer par carte"}
      </Button>
    </div>
  )
}

export default function StripeCardForm() {
  const [options, setOptions] = useState<any>(null)
  const [amount, setAmount] = useState<number>(0)
  const [description, setDescription] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    setOptions(clientSecret ? { clientSecret, appearance: { theme: "stripe" } } : { appearance: { theme: "stripe" } })
  }, [clientSecret])

  if (!options) return null

  if (!clientSecret) {
    return (
      <div className="space-y-3">
        <Input
          type="number"
          min={1}
          placeholder="Montant (EUR)"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button
          disabled={amount <= 0}
          onClick={async () => {
            const res = await apiClient.createPaymentIntent({ amount, currency: "eur", payment_type: "service", description })
            if (res.client_secret) setClientSecret(res.client_secret)
          }}
        >
          Créer l'intention
        </Button>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <InnerCardForm />
    </Elements>
  )
}
