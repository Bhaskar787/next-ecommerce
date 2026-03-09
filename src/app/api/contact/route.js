// app/api/contact/route.js
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

// GET - Get all contacts with pagination and search
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        count: contacts.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: contacts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all contacts error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch contacts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new contact
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and message are required",
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await Contact.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create contact error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create contact",
        error: error.message,
      },
      { status: 500 }
    );
  }
}