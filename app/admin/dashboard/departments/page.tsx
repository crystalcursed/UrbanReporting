"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, Building, Users, Wrench, Mail, Phone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from '@/components/ui/use-toast'

interface Department {
  id: string;
  name: string;
  head: string;
  contactEmail: string;
  contactPhone: string;
  activeIssues: number;
  workers: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "D001",
      name: "Public Works",
      head: "Michael Scott",
      contactEmail: "publicworks@city.gov",
      contactPhone: "+1-555-0001",
      activeIssues: 45,
      workers: 30,
    },
    {
      id: "D002",
      name: "Transportation",
      head: "Dwight Schrute",
      contactEmail: "transport@city.gov",
      contactPhone: "+1-555-0002",
      activeIssues: 23,
      workers: 25,
    },
    {
      id: "D003",
      name: "Utilities",
      head: "Pam Beesly",
      contactEmail: "utilities@city.gov",
      contactPhone: "+1-555-0003",
      activeIssues: 34,
      workers: 20,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = useState(false)
  const [newDepartment, setNewDepartment] = useState<Omit<Department, 'id'>>({
    name: "", head: "", contactEmail: "", contactPhone: "", activeIssues: 0, workers: 0
  })

  const { toast } = useToast()

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.head || !newDepartment.contactEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    const id = `D${String(departments.length + 1).padStart(3, '0')}`
    const deptToAdd = { ...newDepartment, id }
    setDepartments([...departments, deptToAdd])
    setNewDepartment({ name: "", head: "", contactEmail: "", contactPhone: "", activeIssues: 0, workers: 0 })
    setIsAddDepartmentDialogOpen(false)
    toast({
      title: "Success",
      description: `Department ${deptToAdd.name} added successfully!`,
    })
  }

  const handleViewDetails = (dept: Department) => {
    toast({
      title: `Department Details: ${dept.name}`,
      description: `Head: ${dept.head}, Active Issues: ${dept.activeIssues}, Workers: ${dept.workers}`,
    })
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Departments Management</h1>
        <p className="text-muted-foreground">Manage city departments and their assigned responsibilities.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search departments by name or head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDepartmentDialogOpen} onOpenChange={setIsAddDepartmentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add New Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>Enter details for the new department.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dept-name" className="text-right">Name</Label>
                <Input id="dept-name" value={newDepartment.name} onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dept-head" className="text-right">Head</Label>
                <Input id="dept-head" value={newDepartment.head} onChange={(e) => setNewDepartment({...newDepartment, head: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dept-email" className="text-right">Email</Label>
                <Input id="dept-email" type="email" value={newDepartment.contactEmail} onChange={(e) => setNewDepartment({...newDepartment, contactEmail: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dept-phone" className="text-right">Phone</Label>
                <Input id="dept-phone" type="tel" value={newDepartment.contactPhone} onChange={(e) => setNewDepartment({...newDepartment, contactPhone: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddDepartment}>Add Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>City Departments</CardTitle>
          <CardDescription>Overview of all operational departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDepartments.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-muted-foreground">No departments found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              filteredDepartments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Building className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">Head: {dept.head}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {dept.contactEmail}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {dept.contactPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{dept.activeIssues}</p>
                      <p className="text-xs text-muted-foreground">Active Issues</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{dept.workers}</p>
                      <p className="text-xs text-muted-foreground">Workers</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(dept)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
