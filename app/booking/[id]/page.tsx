"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function BookingPage({ params }: { params: { id: string } }) {
  const [selectedDates, setSelectedDates] = useState<number[]>([1])
  const [step, setStep] = useState<"dates" | "invite">("dates")
  const [invitedHackers, setInvitedHackers] = useState<{ name: string; role: string; avatar: string }[]>([])
  const [newHackerName, setNewHackerName] = useState("")
  const [newHackerRole, setNewHackerRole] = useState("")

  const handleDateSelect = (date: number) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const addHacker = () => {
    if (newHackerName && newHackerRole) {
      setInvitedHackers([
        ...invitedHackers,
        {
          name: newHackerName,
          role: newHackerRole,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newHackerName}`,
        },
      ])
      setNewHackerName("")
      setNewHackerRole("")
    }
  }

  const removeHacker = (index: number) => {
    setInvitedHackers(invitedHackers.filter((_, i) => i !== index))
  }

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  if (step === "invite") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-8">
            <Button size="icon" variant="ghost" onClick={() => setStep("dates")} className="hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold gradient-primary bg-clip-text text-transparent">
                Invite Other Hackers!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Build together, split costs</span>
              </div>
            </div>
          </div>

          <Card className="mb-6 glass-card shadow-lg rounded-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2 text-foreground">
                ETH Global Buenos Aires - Private room Palermo
              </h2>
              <p className="text-muted-foreground mb-4">August 15-17 • {selectedDates.length} nights</p>

              <div className="space-y-3 mb-4">
                <Input
                  placeholder="Hacker name"
                  value={newHackerName}
                  onChange={(e) => setNewHackerName(e.target.value)}
                  className="rounded-lg border-border bg-input glass-card"
                />
                <Input
                  placeholder="Role (e.g., Frontend Dev, Designer)"
                  value={newHackerRole}
                  onChange={(e) => setNewHackerRole(e.target.value)}
                  className="rounded-lg border-border bg-input glass-card"
                />
                <Button
                  onClick={addHacker}
                  className="w-full gradient-primary hover:opacity-90 rounded-lg glass text-primary-foreground"
                  disabled={!newHackerName || !newHackerRole}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hacker
                </Button>
              </div>

              {invitedHackers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Users className="w-4 h-4" />
                    Invited Hackers ({invitedHackers.length})
                  </div>
                  {invitedHackers.map((hacker, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted glass-card rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm glass">
                          {hacker.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{hacker.name}</div>
                          <div className="text-xs text-muted-foreground">{hacker.role}</div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeHacker(index)}
                        className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
            <div className="max-w-md mx-auto">
              <Link href={`/checkout/${params.id}?hackers=${invitedHackers.length + 1}`}>
                <Button className="w-full gradient-primary hover:opacity-90 h-12 rounded-lg shadow-lg glass text-primary-foreground">
                  Check Out ({invitedHackers.length + 1} {invitedHackers.length === 0 ? "person" : "people"})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/property/${params.id}`}>
            <Button size="icon" variant="ghost" className="hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">ETH Global Buenos Aires - Private room Palermo</h1>
            <p className="text-muted-foreground">August 15-17</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 gradient-primary bg-clip-text text-transparent">
          How long will you hack for?
        </h2>

        <Card className="mb-8 glass-card shadow-lg rounded-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="icon" variant="ghost" className="hover:bg-muted">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-semibold text-foreground">August 2025</h3>
              <Button size="icon" variant="ghost" className="hover:bg-muted">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date) => (
                <Button
                  key={date}
                  variant={selectedDates.includes(date) ? "default" : "ghost"}
                  className={`h-10 w-10 p-0 transition-all duration-300 ${
                    selectedDates.includes(date)
                      ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-lg glass"
                      : "hover:bg-muted hover:text-primary"
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  {date}
                </Button>
              ))}
            </div>

            {selectedDates.length > 0 && (
              <div className="mt-4 p-3 bg-primary/10 glass-card rounded-lg">
                <div className="text-sm font-medium text-primary">
                  Selected: {selectedDates.length} night{selectedDates.length !== 1 ? "s" : ""}
                </div>
                <div className="text-xs text-primary/80 mt-1">
                  Dates: {selectedDates.sort((a, b) => a - b).join(", ")} August
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
          <div className="max-w-md mx-auto">
            <Button
              className="w-full gradient-primary hover:opacity-90 h-12 rounded-lg shadow-lg glass text-primary-foreground"
              onClick={() => setStep("invite")}
              disabled={selectedDates.length === 0}
            >
              Apply ({selectedDates.length} night{selectedDates.length !== 1 ? "s" : ""})
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
