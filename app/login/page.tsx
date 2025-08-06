"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Upload, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [citizenForm, setCitizenForm] = useState({ email: "", password: "" })
  const [adminForm, setAdminForm] = useState({
    govId: "",
    password: "",
    department: "",
    idProof: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to citizen dashboard
      router.push("/dashboard/")
    }, 1500)
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call with government ID verification
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAdminForm({ ...adminForm, idProof: file })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Services Portal</h1>
          <p className="text-gray-600">Access your account or administrative panel</p>
        </div>

        <Tabs defaultValue="citizen" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="citizen" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Citizen Login
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizen">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Citizen Access
                </CardTitle>
                <CardDescription>Login to submit and track your issues</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCitizenLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="citizen-email">Email Address</Label>
                    <Input
                      id="citizen-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={citizenForm.email}
                      onChange={(e) => setCitizenForm({ ...citizenForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizen-password">Password</Label>
                    <Input
                      id="citizen-password"
                      type="password"
                      value={citizenForm.password}
                      onChange={(e) => setCitizenForm({ ...citizenForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Government Official Access
                </CardTitle>
                <CardDescription>Secure login for authorized personnel only</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gov-id">Government ID Number</Label>
                    <Input
                      id="gov-id"
                      placeholder="GOV-ID-XXXXXXXX"
                      value={adminForm.govId}
                      onChange={(e) => setAdminForm({ ...adminForm, govId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Public Works, Health, Education"
                      value={adminForm.department}
                      onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Secure Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id-proof">Government ID Proof</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        id="id-proof"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        required
                      />
                      <label htmlFor="id-proof" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {adminForm.idProof ? adminForm.idProof.name : "Upload ID Document"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                    {adminForm.idProof && (
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <FileText className="w-3 h-3" />
                        Document uploaded
                      </Badge>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying Credentials..." : "Secure Login"}
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <Shield className="w-3 h-3 inline mr-1" />
                    This is a secure government portal. Unauthorized access is prohibited.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
