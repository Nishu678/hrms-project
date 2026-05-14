"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trash2, Filter, Plus, Search, Edit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddEmployeeModal from "./AddEmployeeModal";
import formatDate from "@/components/common/formatDate";
import DeleteEmployeeModal from "./DeleteEmployeeModal";

interface Employee {
  id: string;
  name: string;
  phone: string;
  employeeId: string;
  joiningDate: string;
  jobTitle: string;
  department: string;
  employmentStatus: "active" | "on_leave" | "inactive";
  email?: string;
}

const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Eleanor Pena",
    jobTitle: "Product Manager",
    department: "Marketing",
    employmentStatus: "active",
    email: "eleanor.pena@company.com",
    phone: "555-0101",
    employeeId: "EMP001",
    joiningDate: "2024-01-15",
  },
  {
    id: "EMP002",
    name: "Cody Fisher",
    jobTitle: "Network Admin",
    department: "IT",
    employmentStatus: "active",
    email: "cody.fisher@company.com",
    phone: "555-0102",
    employeeId: "EMP002",
    joiningDate: "2024-02-20",
  },
  {
    id: "EMP003",
    name: "Esther Howard",
    jobTitle: "Recruiter",
    department: "HR",
    employmentStatus: "on_leave",
    email: "esther.howard@company.com",
    phone: "555-0103",
    employeeId: "EMP003",
    joiningDate: "2024-03-10",
  },
  {
    id: "EMP004",
    name: "Robert Fox",
    jobTitle: "Software Engineer",
    department: "IT",
    employmentStatus: "active",
    email: "robert.fox@company.com",
    phone: "555-0104",
    employeeId: "EMP004",
    joiningDate: "2024-04-05",
  },
  {
    id: "EMP005",
    name: "Kristin Watson",
    jobTitle: "Developer",
    department: "Product",
    employmentStatus: "active",
    email: "kristin.watson@company.com",
    phone: "555-0105",
    employeeId: "EMP005",
    joiningDate: "2024-05-12",
  },
  {
    id: "EMP006",
    name: "Annie Johnson",
    jobTitle: "Financial Analyst",
    department: "Finance",
    employmentStatus: "active",
    email: "annie.johnson@company.com",
    phone: "555-0106",
    employeeId: "EMP006",
    joiningDate: "2024-06-01",
  },
];

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStatusVariant = (
  status: Employee["status"],
): "success" | "warning" | "secondary" => {
  switch (status) {
    case "active":
      return "success";
    case "on_leave":
      return "warning";
    case "inactive":
      return "secondary";
    default:
      return "secondary";
  }
};

const getStatusText = (status: Employee["employmentStatus"]): string => {
  switch (status) {
    case "active":
      return "Active";
    case "on_leave":
      return "On Leave";
    case "inactive":
      return "Inactive";
    default:
      return status;
  }
};

const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-emerald-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const EmployeesList = () => {
  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const {
    data: employeesList,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["employeesList"],
    queryFn: async () => {
      const response = await axios.get("/api/employees");
      return response?.data;
    },
  });

  const employees = employeesList?.data || mockEmployees;

  return (
    <>
      <Card className="h-full min-h-screen">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {employees.length} employees
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="default"
                className="flex-1 sm:flex-none"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="default"
                size="default"
                className="flex-1 sm:flex-none gap-0"
                onClick={() => setOpenAddEmployeeModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 max-h-[800px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Employee</TableHead>
                <TableHead>Emp ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-86">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : employees?.length > 0 ? (
                employees?.map((employee: Employee) => (
                  <TableRow key={employee?.id}>
                    <TableCell className="font-medium pl-6 py-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full ${getAvatarColor(
                            employee?.name,
                          )} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}
                        >
                          {getInitials(employee?.name)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {employee?.name || "-"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee?.employeeId || "-"}</TableCell>
                    <TableCell>{employee?.phone || "-"}</TableCell>
                    <TableCell>
                      {formatDate(employee?.joiningDate) || "-"}
                    </TableCell>
                    <TableCell>{employee?.jobTitle || "-"}</TableCell>
                    <TableCell>{employee?.department || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(employee?.employmentStatus)}
                      >
                        {getStatusText(employee?.employmentStatus || "unknown")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-yellow/10 border border-gray-200 hover:border-gray-300"
                        >
                          <Edit className="h-4 w-4 text-yellow-500 transition-transform duration-200 hover:scale-110" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-gray-200 hover:border-gray-300"
                          onClick={() => {
                            setSelectedUser({
                              ...employee,
                              id: employee.employeeId,
                            });
                            setOpenDeleteModal(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-86">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddEmployeeModal
        open={openAddEmployeeModal}
        onOpenChange={setOpenAddEmployeeModal}
        onEmployeeAdded={() => refetch()}
      />
      <DeleteEmployeeModal
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        employee={selectedUser}
        onEmployeeDeleted={() => refetch()}
      />
    </>
  );
};

export default EmployeesList;
