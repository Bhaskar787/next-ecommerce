import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

// GET category by ID
export async function GET(request, context) {
  try {
    await connectDB();
    const id = context?.params?.id || request.url.split("/").pop();
    const category = await Category.findById(id);

    if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


    //delete category by ID 
export async function DELETE(request, context) {
  try {
    await connectDB();
    const id = context?.params?.id || request.url.split("/").pop();
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category deleted" }, { status: 200 });

  }
    catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//update category by ID
export async function PUT(request, context) {
  try {
    await connectDB();
    const id = context?.params?.id || request.url.split("/").pop();
    const { name } = await request.json();
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category, { status: 200 });

  }
    catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
  
