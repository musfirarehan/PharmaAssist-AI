"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Pill, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildApiUrl } from "@/lib/api"

export function PortalGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [portal, setPortal] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [role, setRole] = useState<"patient" | "pharmacist">("patient")
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    licenseAuthority: "",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [login, setLogin] = useState({ username: "", password: "" })

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setPortal(null)
        setRegistered(false)
        return
      }

      try {
        const response = await fetch(buildApiUrl("/v1/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok || !payload?.success) throw new Error("Session expired")

        const authenticatedRole = payload.data.user?.role || payload.data.role
        setPortal(authenticatedRole)
        setRegistered(true)
        localStorage.setItem("portal", authenticatedRole)
        localStorage.setItem("registration", "complete")
        localStorage.setItem("profile", JSON.stringify(payload.data.user || payload.data))
      } catch {
        localStorage.removeItem("authToken")
        localStorage.removeItem("registration")
        setPortal(null)
        setRegistered(false)
      }
    }

    validateSession()
  }, [])

  const register = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (role === "pharmacist" && !form.licenseNumber.trim()) {
      setError("A pharmacist license number is required.")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(buildApiUrl("/v1/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
          role,
          license_number: form.licenseNumber.trim(),
          license_authority: form.licenseAuthority.trim(),
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || payload?.message || "Registration failed.")
      }

      const authenticatedUser = payload.data.user
      const authenticatedRole = authenticatedUser.role as "patient" | "pharmacist"
      localStorage.setItem("authToken", payload.data.token)
      localStorage.setItem("portal", authenticatedRole)
      localStorage.setItem("registration", "complete")
      localStorage.setItem("profile", JSON.stringify(authenticatedUser))
      setPortal(authenticatedRole)
      setRegistered(true)
      router.push(authenticatedRole === "patient" ? "/patient" : "/")
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "Registration failed.")
    } finally {
      setSubmitting(false)
    }
  }

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const response = await fetch(buildApiUrl("/v1/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || payload?.message || "Login failed.")
      }

      const authenticatedUser = payload.data.user
      const authenticatedRole = authenticatedUser.role as "patient" | "pharmacist"
      localStorage.setItem("authToken", payload.data.token)
      localStorage.setItem("portal", authenticatedRole)
      localStorage.setItem("registration", "complete")
      localStorage.setItem("profile", JSON.stringify(authenticatedUser))
      setPortal(authenticatedRole)
      setRegistered(true)
      router.push(authenticatedRole === "patient" ? "/patient" : "/")
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.")
    } finally {
      setSubmitting(false)
    }
  }

  const wrongPortal =
    (portal === "patient" && !["/patient", "/patient/counseling", "/patient/safety", "/patient/history", "/upload", "/chat", "/reminders"].includes(pathname)) ||
    (portal === "pharmacist" && pathname === "/patient")

  return (
    <>
      {children}
      {!portal || !registered || wrongPortal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm">
          <Card className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {authMode === "login" ? "Welcome back" : "Create your PharmaAssist account"}
              </CardTitle>
              <CardDescription>
                {authMode === "login"
                  ? "Sign in to access your PharmaAssist portal."
                  : "Register to access the portal designed for your role."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authMode === "login" ? (
                <form className="flex flex-col gap-5" onSubmit={signIn}>
                  <div className="grid gap-2">
                    <Label htmlFor="login-username">Username or email</Label>
                    <Input id="login-username" required value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} placeholder="Enter your username or email" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" required type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} placeholder="Enter your password" />
                  </div>
                  {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Signing in..." : "Sign in"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <button type="button" className="font-medium text-primary underline underline-offset-4" onClick={() => { setAuthMode("register"); setError("") }}>
                      Register here
                    </button>
                  </p>
                </form>
              ) : (
              <form className="flex flex-col gap-5" onSubmit={register}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant={role === "patient" ? "default" : "outline"}
                    className="h-auto justify-start gap-3 p-4 text-left"
                    onClick={() => setRole("patient")}
                  >
                    <Pill className="size-5" />
                    <span>
                      <span className="block font-semibold">Patient</span>
                      <span className="block text-xs font-normal opacity-80">Medicines and reminders</span>
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant={role === "pharmacist" ? "default" : "outline"}
                    className="h-auto justify-start gap-3 p-4 text-left"
                    onClick={() => setRole("pharmacist")}
                  >
                    <Stethoscope className="size-5" />
                    <span>
                      <span className="block font-semibold">Pharmacist</span>
                      <span className="block text-xs font-normal opacity-80">Analysis and reports</span>
                    </span>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="registration-name">Full name</Label>
                    <Input id="registration-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registration-email">Email address</Label>
                    <Input id="registration-email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registration-username">Username</Label>
                    <Input id="registration-username" required minLength={3} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Choose a username" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registration-password">Password</Label>
                    <Input id="registration-password" required type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registration-confirm-password">Confirm password</Label>
                    <Input id="registration-confirm-password" required type="password" minLength={8} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Re-enter your password" />
                  </div>
                  {role === "pharmacist" ? (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="registration-license-number">License number</Label>
                        <Input id="registration-license-number" required value={form.licenseNumber} onChange={(event) => setForm({ ...form, licenseNumber: event.target.value })} placeholder="Professional license number" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="registration-license-authority">Issuing authority</Label>
                        <Input id="registration-license-authority" value={form.licenseAuthority} onChange={(event) => setForm({ ...form, licenseAuthority: event.target.value })} placeholder="State or country authority" />
                      </div>
                    </>
                  ) : null}
                </div>

                {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating account..." : `Create ${role} account`}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button type="button" className="font-medium text-primary underline underline-offset-4" onClick={() => { setAuthMode("login"); setError("") }}>
                    Sign in
                  </button>
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Your password is securely hashed by the server and never stored in plain text.
                </p>
              </form>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
