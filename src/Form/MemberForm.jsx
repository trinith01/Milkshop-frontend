"use client"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema Validation
const formSchema = z.object({
  name: z.string().min(3, "Must be greater than 3 characters"),
  nic: z.string().min(10, "Must be at least 10 characters"),
  address: z.string().min(10, "Must be greater than 10 characters"),
});

export default function MemberForm({ editMode, setDialogOpen, id ,setReloadData }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    nic: "",
    address: "",
  });


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Fetch existing data if in edit mode
  useEffect(() => {
    if (editMode && id) {
      const fetchMember = async () => {
        try {
          const res = await axios.get(`${backendURL}/employee/${id}`);
          setDefaultValues(res.data);
          form.reset(res.data); // Update form state
        } catch (error) {
          toast.error("Failed to fetch member data.");
        }
      };
      fetchMember();
    }
  }, [editMode, id, form ]);

  async function onSubmit(values) {
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`${backendURL}/employees/${id}`, values);
        toast.success("✅ Member updated successfully!");
        setReloadData(pre => !pre);
        setDialogOpen(false);
      } else {
        await axios.post(`${backendURL}/employees`, values);
        toast.success("✅ Member added successfully! 🎉");
        setReloadData(pre => !pre);
        setDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Sahan Amarathunga" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIC</FormLabel>
              <FormControl>
                <Input placeholder="200124802608" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="No. 32, Molligoda, Wackwella" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : editMode ? "Update Member" : "Add Member"}
        </Button>
      </form>
    </Form>
  );
}
