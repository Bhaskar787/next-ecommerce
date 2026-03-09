// app/api/contact/[id]/route.js
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

// GET - Get contact by ID
export async function GET(req, { params: paramsPromise }) {
  try {
    await connectDB();
    const params = await paramsPromise;
    const { id } = params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    // Mark as read
    contact.read = true;
    await contact.save();

    return NextResponse.json(
      { success: true, data: contact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get contact by ID error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact", error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update contact status or other fields
export async function PUT(req, { params: paramsPromise }) {
  try {
    await connectDB();
    const params = await paramsPromise;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, ...otherFields } = body;

    // Build update object
    const updateData = {};
    if (status) {
      const validStatuses = ["new", "in-progress", "resolved", "closed"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status value" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    
    // Allow updating other fields
    Object.assign(updateData, otherFields);

    const contact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found", id: id },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Contact updated successfully", data: contact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update contact error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update contact", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact by ID
export async function DELETE(req, { params: paramsPromise }) {
  try {
    await connectDB();
    const params = await paramsPromise;
    const { id } = params;

    console.log("DELETE request received for ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID is required" },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found", id: id },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Contact deleted successfully", id: id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete contact", error: error.message },
      { status: 500 }
    );
  }
}