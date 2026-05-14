import { dbConnect } from "@/lib/db";
import Employee from "@/models/Employees";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Extract fields with destructuring
        const {
            name,
            email,
            phone,
            dateOfBirth,
            gender,
            street,
            city,
            state,
            zipCode,
            country,
            contactName,
            contactRelationship,
            contactPhone,
            employeeId,
            department,
            jobTitle,
            employmentType,
            joiningDate,
            workLocation,
            workShift,
            salary,
            skills,
            qualifications,
            notes
        } = body;

        // Validation
        if (!name || !email) {
            return Response.json({
                success: false,
                message: "Name and email are required"
            }, { status: 400 });
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return Response.json({
                success: false,
                message: "Employee with this email already exists"
            }, { status: 400 });
        }

        // Validate and structure salary
        let salaryData = {};
        if (salary) {
            if (typeof salary === 'object' && salary.amount) {
                // Salary is already properly structured
                salaryData = salary;
            } else if (typeof salary === 'number') {
                // Convert simple number to proper salary object
                salaryData = {
                    amount: salary,
                    currency: "USD",
                    payPeriod: "annually"
                };
            } else {
                return Response.json({
                    success: false,
                    message: "Invalid salary format. Expected object with amount or a number"
                }, { status: 400 });
            }
        }

        // Create employee with validated data
        const employee = await Employee.create({
            name,
            email,
            phone,
            dateOfBirth,
            gender,
            street,
            city,
            state,
            zipCode,
            country,
            emergencyContact: {
                name: contactName,
                relationship: contactRelationship,
                phone: contactPhone
            },
            employeeId,
            department,
            jobTitle,
            employmentType,
            joiningDate,
            workLocation,
            workShift,
            salary: salaryData,
            skills,
            qualifications,
            notes
        });

        return Response.json({
            success: true,
            message: "Employee created successfully",
            employee
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("Error creating employee:", error);

        // Handle specific Mongoose errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return Response.json({
                success: false,
                message: "Duplicate field value entered"
            }, { status: 400 });
        }

        if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
            return Response.json({
                success: false,
                message: 'message' in error ? error.message : "Validation error"
            }, { status: 400 });
        }

        return Response.json({
            success: false,
            message: "Internal server error",
            error: error && typeof error === 'object' && 'message' in error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10; //to get the values from the query parameters acc skip the element acc to the page number and limit the number of records to be fetched
        const skip = (page - 1) * limit;
        const employees = await Employee.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalEmployees = await Employee.countDocuments();
        return Response.json({
            success: true,
            data: employees,
            pagination: {
                total: totalEmployees,
                page,
                limit,
                totalPages: Math.ceil(totalEmployees / limit)
            }
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error fetching employees:", error);
        return Response.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}
export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { id } = await req.json();
        const deletedEmployee = await Employee.findOneAndDelete({ employeeId: id });

        if (!deletedEmployee) {
            return Response.json({
                success: false,
                message: "Employee not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Employee deleted successfully"
        }, { status: 200 });


    } catch (error: unknown) {
        console.error("Error deleting employees:", error);
        return Response.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { id } = await req.json();
        await Employee.findByIdAndDelete(id);
        return Response.json({
            success: true,
            message: "Employee deleted successfully"
        }, { status: 200 });


    } catch (error: unknown) {
        console.error("Error deleting employees:", error);
        return Response.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}

