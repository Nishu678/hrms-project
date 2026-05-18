"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  employeeId?: string;
  joiningDate?: string;
  jobTitle?: string;
  department?: string;
  employmentStatus?: "active" | "on_leave" | "inactive";
}

interface DeleteEmployeeModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  employee?: Employee | null;
  onEmployeeDeleted?: () => void;
}

export default function DeleteEmployeeModal({
  open: controlledOpen,
  onOpenChange,
  employee,
  onEmployeeDeleted,
}: DeleteEmployeeModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Mutation for deleting employee
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/employees", {
        data: { id },
      });
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Employee deleted successfully!");
      setOpen(false);
      if (onEmployeeDeleted) {
        onEmployeeDeleted();
      }
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete employee. Please try again.",
      );
    },
  });

  const handleDelete = () => {
    console.log("handleDelete called, employee:", employee);
    console.log("employee._id:", employee?._id);
    if (!employee?._id) {
      console.log("No employee _id, returning early");
      return;
    }
    deleteEmployeeMutation.mutate(employee._id);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{employee?.name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This will permanently delete the employee record from the system.
            All associated data will be lost.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteEmployeeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteEmployeeMutation.isPending}
          >
            {deleteEmployeeMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
