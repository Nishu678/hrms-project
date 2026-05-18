"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Zod schema for employee validation
const employeeSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),

  // Address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Employment Details
  employeeId: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  employmentType: z.enum(["full_time", "part_time", "contract", "intern"], {
    required_error: "Employment type is required",
  }),
  joiningDate: z.string().min(1, "Joining date is required"),
  salaryAmount: z.string().optional(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.enum(["hourly", "monthly", "annually"]).optional(),
  employmentStatus: z
    .enum(["active", "inactive", "terminated", "resigned", "on_leave"])
    .optional(),

  // Work Information
  workLocation: z.string().optional(),
  workShift: z.string().optional(),

  // Additional Information
  skills: z.string().optional(),
  qualifications: z.string().optional(),
  notes: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface AddEmployeeModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEmployeeAdded?: () => void;
  employee?: Employee | null;
}

export default function AddEmployeeModal({
  open: controlledOpen,
  onOpenChange,
  onEmployeeAdded,
  employee,
}: AddEmployeeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      gender: "prefer_not_to_say",
      employmentType: "full_time",
      employmentStatus: "active",
      salaryCurrency: "USD",
      salaryPeriod: "monthly",
      country: "USA",
    },
  });

  // Mutation for adding employee
  const addEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const response = await axios.post("/api/employees", {
        // Basic fields
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        employeeId: data.employeeId,
        department: data.department,
        jobTitle: data.jobTitle,
        employmentType: data.employmentType,
        joiningDate: new Date(data.joiningDate),
        employmentStatus: data.employmentStatus,
        workLocation: data.workLocation,
        workShift: data.workShift,
        notes: data.notes,

        // Nested objects
        salary: {
          amount: data.salaryAmount ? parseFloat(data.salaryAmount) : undefined,
          currency: data.salaryCurrency,
          payPeriod: data.salaryPeriod,
        },
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        emergencyContact: {
          name: data.emergencyContactName,
          relationship: data.emergencyContactRelationship,
          phone: data.emergencyContactPhone,
        },

        // Array fields
        skills: data.skills ? data.skills.split(",").map((s) => s.trim()) : [],
        qualifications: data.qualifications
          ? data.qualifications.split(",").map((q) => q.trim())
          : [],
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Employee added successfully!");
      reset();
      setOpen(false);
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }
    },
    onError: (error) => {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee. Please try again.");
    },
  });

  useEffect(() => {
    if (employee) {
      setValue("name", employee.name);
      setValue("email", employee.email || "");
      setValue("phone", employee.phone || "");
      setValue(
        "dateOfBirth",
        employee.dateOfBirth
          ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
          : "",
      );
      setValue("gender", employee.gender || "");
      setValue("employeeId", employee.employeeId || "");
      setValue("department", employee.department || "");
      setValue("jobTitle", employee.jobTitle || "");
      setValue("employmentType", employee.employmentType || "");
      setValue(
        "joiningDate",
        employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split("T")[0]
          : "",
      );
      setValue("employmentStatus", employee.employmentStatus || "");
      setValue("workLocation", employee.workLocation || "");
      setValue("workShift", employee.workShift || "");
      setValue("notes", employee.notes || "");
      setValue("salaryAmount", employee.salary?.amount?.toString() || "");
      setValue("salaryCurrency", employee.salary?.currency || "USD");
      setValue("salaryPeriod", employee.salary?.payPeriod || "monthly");
      setValue("street", employee.address?.street || "");
      setValue("city", employee.address?.city || "");
      setValue("state", employee.address?.state || "");
      setValue("zipCode", employee.address?.zipCode || "");
      setValue("country", employee.address?.country || "USA");
      setValue("emergencyContactName", employee.emergencyContact?.name || "");
      setValue(
        "emergencyContactRelationship",
        employee.emergencyContact?.relationship || "",
      );
      setValue("emergencyContactPhone", employee.emergencyContact?.phone || "");
      setValue("skills", employee.skills?.join(", ") || "");
      setValue("qualifications", employee.qualifications?.join(", ") || "");
    } else {
      reset();
    }
  }, [employee, setValue, reset]);

  // Mutation for updating employee
  const updateEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const response = await axios.put("/api/employees", {
        id: employee?._id,
        // Basic fields
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        employeeId: data.employeeId,
        department: data.department,
        jobTitle: data.jobTitle,
        employmentType: data.employmentType,
        joiningDate: new Date(data.joiningDate),
        employmentStatus: data.employmentStatus,
        workLocation: data.workLocation,
        workShift: data.workShift,
        notes: data.notes,

        // Nested objects
        salary: {
          amount: data.salaryAmount ? parseFloat(data.salaryAmount) : undefined,
          currency: data.salaryCurrency,
          payPeriod: data.salaryPeriod,
        },
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        emergencyContact: {
          name: data.emergencyContactName,
          relationship: data.emergencyContactRelationship,
          phone: data.emergencyContactPhone,
        },

        // Array fields
        skills: data.skills ? data.skills.split(",").map((s) => s.trim()) : [],
        qualifications: data.qualifications
          ? data.qualifications.split(",").map((q) => q.trim())
          : [],
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Employee updated successfully!");
      reset();
      setOpen(false);
      if (onEmployeeAdded) {
        onEmployeeAdded();
      }
    },
    onError: (error) => {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee. Please try again.");
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    // Use update mutation if editing, otherwise use create mutation
    if (employee?._id) {
      updateEmployeeMutation.mutate(data);
    } else {
      addEmployeeMutation.mutate(data);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        className="overflow-y-auto sm:w-full md:w-[700px] lg:w-[900px] xl:w-[1100px]"
        style={{ width: "40vw", maxWidth: "1100px" }}
      >
        <SheetHeader>
          <SheetTitle className="text-xl">
            {employee ? "Edit Employee" : "Add Employee"}
          </SheetTitle>
          <SheetDescription>
            Fill in the employee details below. Click save when you&apos;re
            done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" {...register("name")} placeholder="John Doe" />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+1234567890"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={watch("gender")}
                  onValueChange={(value) =>
                    setValue(
                      "gender",
                      value as
                        | "male"
                        | "female"
                        | "other"
                        | "prefer_not_to_say",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register("street")}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} placeholder="New York" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} placeholder="NY" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="10001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Contact</h3>

            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              <Input
                id="emergencyContactName"
                {...register("emergencyContactName")}
                placeholder="Jane Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">
                  Relationship
                </Label>
                <Input
                  id="emergencyContactRelationship"
                  {...register("emergencyContactRelationship")}
                  placeholder="Spouse"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  {...register("emergencyContactPhone")}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  {...register("employeeId")}
                  placeholder="EMP001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  {...register("department")}
                  placeholder="Engineering"
                />
                {errors.department && (
                  <p className="text-sm text-destructive">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                {...register("jobTitle")}
                placeholder="Software Engineer"
              />
              {errors.jobTitle && (
                <p className="text-sm text-destructive">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  value={watch("employmentType")}
                  onValueChange={(value) =>
                    setValue(
                      "employmentType",
                      value as
                        | "full_time"
                        | "part_time"
                        | "contract"
                        | "intern",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && (
                  <p className="text-sm text-destructive">
                    {errors.employmentType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  {...register("joiningDate")}
                />
                {errors.joiningDate && (
                  <p className="text-sm text-destructive">
                    {errors.joiningDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryAmount">Salary Amount</Label>
                <Input
                  id="salaryAmount"
                  type="number"
                  {...register("salaryAmount")}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryCurrency">Currency</Label>
                <Select
                  value={watch("salaryCurrency")}
                  onValueChange={(value) =>
                    setValue(
                      "salaryCurrency",
                      value as "USD" | "EUR" | "GBP" | "INR",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryPeriod">Pay Period</Label>
                <Select
                  value={watch("salaryPeriod")}
                  onValueChange={(value) =>
                    setValue(
                      "salaryPeriod",
                      value as "hourly" | "monthly" | "annually",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Monthly" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select
                value={watch("employmentStatus")}
                onValueChange={(value) =>
                  setValue(
                    "employmentStatus",
                    value as
                      | "active"
                      | "inactive"
                      | "terminated"
                      | "resigned"
                      | "on_leave",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Work Information</h3>

            <div className="space-y-2">
              <Label htmlFor="workLocation">Work Location</Label>
              <Input
                id="workLocation"
                {...register("workLocation")}
                placeholder="New York Office"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workShift">Work Shift</Label>
              <Input
                id="workShift"
                {...register("workShift")}
                placeholder="9 AM - 5 PM"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                {...register("skills")}
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">
                Qualifications (comma-separated)
              </Label>
              <Input
                id="qualifications"
                {...register("qualifications")}
                placeholder="BSCS, AWS Certified"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Additional notes about the employee..."
              />
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={
                addEmployeeMutation.isPending ||
                updateEmployeeMutation.isPending
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                addEmployeeMutation.isPending ||
                updateEmployeeMutation.isPending
              }
            >
              {(addEmployeeMutation.isPending ||
                updateEmployeeMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Employee
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
