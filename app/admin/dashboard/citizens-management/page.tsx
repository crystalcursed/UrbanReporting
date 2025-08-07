"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, User, Mail, Phone, MapPin, Edit, Trash, Plus } from 'lucide-react'
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

interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  issuesReported: number;
  status: string;
  avatar: string;
}

export default function CitizensManagementPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([
    {
      id: "C001",
      name: "Alice Wonderland",
      email: "alice@example.com",
      phone: "+1-555-1111",
      address: "123 Rabbit Hole, Fantasyland",
      issuesReported: 12,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "C002",
      name: "Bob The Builder",
      email: "bob@example.com",
      phone: "+1-555-2222",
      address: "456 Construction Site, Builderville",
      issuesReported: 5,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "C003",
      name: "Charlie Chaplin",
      email: "charlie@example.com",
      phone: "+1-555-3333",
      address: "789 Silent Film St, Hollywood",
      issuesReported: 1,
      status: "Inactive",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCitizenDialogOpen, setIsAddCitizenDialogOpen] = useState(false)
  const [isEditCitizenDialogOpen, setIsEditCitizenDialogOpen] = useState(false)
  const [newCitizen, setNewCitizen] = useState<Omit<Citizen, 'id' | 'avatar'>>({
    name: "", email: "", phone: "", address: "", issuesReported: 0, status: "Active"
  })
  const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null)

  const { toast } = useToast()

  const handleAddCitizen = () => {
    if (!newCitizen.name || !newCitizen.email || !newCitizen.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    const id = `C${String(citizens.length + 1).padStart(3, '0')}`
    const citizenToAdd = { ...newCitizen, id, avatar: "/placeholder.svg?height=40&width=40" }
    setCitizens([...citizens, citizenToAdd])
    setNewCitizen({ name: "", email: "", phone: "", address: "", issuesReported: 0, status: "Active" })
    setIsAddCitizenDialogOpen(false)
    toast({
      title: "Success",
      description: `Citizen ${citizenToAdd.name} added successfully!`,
    })
  }

  const handleEditCitizen = () => {
    if (!editingCitizen?.name || !editingCitizen?.email || !editingCitizen?.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    setCitizens(citizens.map(c => c.id === editingCitizen.id ? editingCitizen : c))
    setIsEditCitizenDialogOpen(false)
    toast({
      title: "Success",
      description: `Citizen ${editingCitizen.name} updated successfully!`,
    })
  }

  const handleDeleteCitizen = (id: string) => {
    setCitizens(citizens.filter(c => c.id !== id))
    toast({
      title: "Success",
      description: `Citizen ${id} deleted successfully!`,
    })
  }

  const filteredCitizens = citizens.filter(citizen =>
    citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citizen.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Citizens Management</h1>
        <p className="text-muted-foreground">Manage registered citizens and their activities.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search citizens by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddCitizenDialogOpen} onOpenChange={setIsAddCitizenDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add New Citizen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Citizen</DialogTitle>
              <DialogDescription>Enter details for the new citizen account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newCitizen.name} onChange={(e) => setNewCitizen({...newCitizen, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={newCitizen.email} onChange={(e) => setNewCitizen({...newCitizen, email: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" type="tel" value={newCitizen.phone} onChange={(e) => setNewCitizen({...newCitizen, phone: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={newCitizen.address} onChange={(e) => setNewCitizen({...newCitizen, address: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCitizen}>Add Citizen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Citizens</CardTitle>
          <CardDescription>Overview of all citizen accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCitizens.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-muted-foreground">No citizens found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              filteredCitizens.map((citizen) => (
                <div key={citizen.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={citizen.avatar || "/placeholder.svg"} alt={citizen.name} />
                      <AvatarFallback>{citizen.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{citizen.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {citizen.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {citizen.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{citizen.issuesReported}</p>
                      <p className="text-xs text-muted-foreground">Issues Reported</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{citizen.status}</p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isEditCitizenDialogOpen && editingCitizen?.id === citizen.id} onOpenChange={setIsEditCitizenDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingCitizen(citizen)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Citizen</DialogTitle>
                            <DialogDescription>Edit details for {editingCitizen?.name}.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">Name</Label>
                              <Input id="edit-name" value={editingCitizen?.name || ''} onChange={(e) => setEditingCitizen({...editingCitizen!, name: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">Email</Label>
                              <Input id="edit-email" type="email" value={editingCitizen?.email || ''} onChange={(e) => setEditingCitizen({...editingCitizen!, email: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                              <Input id="edit-phone" type="tel" value={editingCitizen?.phone || ''} onChange={(e) => setEditingCitizen({...editingCitizen!, phone: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-address" className="text-right">Address</Label>
                              <Input id="edit-address" value={editingCitizen?.address || ''} onChange={(e) => setEditingCitizen({...editingCitizen!, address: e.target.value})} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-status" className="text-right">Status</Label>
                              <Input id="edit-status" value={editingCitizen?.status || ''} onChange={(e) => setEditingCitizen({...editingCitizen!, status: e.target.value})} className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleEditCitizen}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCitizen(citizen.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
