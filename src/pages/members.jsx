"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Plus, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MemberForm from "@/Form/MemberForm";
import axios from "axios";
import { toast } from "sonner";

export default function MembersPage() {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [members, setMembers] = useState([]);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const response = await axios.get(`${backendURL}/employees`);
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    getAllEmployees();
  }, [members]); // Dependency array updated to trigger reload

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleEditMember = (member) => {
    setEditMode(true);
    setDialogOpen(true);
    setCurrentId(member._id);
    setReloadData((prev) => !prev);
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`${backendURL}/employees/${id}`);
      setDeleteDialogOpen(false);
      toast.success(`🗑️ **Member deleted successfully! 😊`);
      setReloadData((prev) => !prev); // Trigger re-fetch
    } catch (err) {
      console.log(err);
      toast.error("Error deleting member");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 border-blue-800 border-2 rounded-lg mt-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members Management</h1>
        <div className="flex gap-4">
          <Link to="/products">
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Go to Products
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="my-6" />
      <div>
        <Card className="mb-8 ">
          <CardHeader className="bg-muted/50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee List
              </CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      setCurrentId(null);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editMode ? "Edit Member" : "Add New Member"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details to{" "}
                      {editMode ? "update the" : "add a new"} member.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <MemberForm
                      editMode={editMode}
                      setDialogOpen={setDialogOpen}
                      id={currentId}
                      setReloadData={setReloadData}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableCaption>List of all registered Employees</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] font-black">Name</TableHead>
                  <TableHead className="w-[200px]">NIC</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right w-[150px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.nic}</TableCell>
                    <TableCell>{member.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditMember(member)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the member and remove their
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(member._id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No members found. Add a new member to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
