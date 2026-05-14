/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const EmployeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        // Personal Information
        phone: { type: String },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
            country: { type: String, default: "USA" }
        },
        emergencyContact: {
            name: { type: String },
            relationship: { type: String },
            phone: { type: String }
        },

        // Employment Details
        employeeId: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
        department: { type: String },
        jobTitle: { type: String },
        employmentType: { type: String, enum: ["full_time", "part_time", "contract", "intern"] },
        joiningDate: { type: Date },
        salary: {
            amount: { type: Number },
            currency: { type: String, default: "USD" },
            payPeriod: { type: String, enum: ["hourly", "monthly", "annually"] }
        },
        employmentStatus: { type: String, enum: ["active", "inactive", "terminated", "resigned", "on_leave"], default: "active" },

        // Work Information
        manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Self-reference to manager
        workLocation: { type: String }, // e.g., "New York Office", "Remote"
        workShift: { type: String }, // e.g., "9 AM - 5 PM", "Night Shift"

        // Profile & Documents
        profileImage: { type: String }, // URL to profile image
        resume: { type: String }, // URL to resume document
        documents: [{
            name: { type: String },
            url: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }],

        // Additional Information
        skills: [{ type: String }], // Array of skills
        qualifications: [{ type: String }], // Array of qualifications/certifications
        notes: { type: String } // Additional notes
    },
    {
        timestamps: true, // auto createdAt & updatedAt
    }
);


const Employee = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

export default Employee;