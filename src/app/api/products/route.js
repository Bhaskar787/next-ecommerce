// import { connectDB } from "@/lib/db";
// import Product from "@/models/Product";
// import { NextResponse } from "next/server";



// // GET all products
// export async function GET() {
//   try {
//     await connectDB();
//     const products = await Product.find().populate("category");
//     return NextResponse.json(products);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// }

// // CREATE product
// export async function POST(request) {
//   try {
//     await connectDB();

//     const { title, description, price, image, stock, category } =
//       await request.json();

//     const product = await Product.create({
//       title,
//       description,
//       price,
//       image,
//       stock,
//       category,
//     });

//     return NextResponse.json(product, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create product" },
//       { status: 500 }
//     );
//   }
// }




import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// GET all products (with optional category filter)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // get category ID from query

    // Build query object
    const query = category ? { category } : {};

    const products = await Product.find(query).populate("category");

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(request) {
  try {
    await connectDB();

    const { title, description, price, image, stock, category } =
      await request.json();

    const product = await Product.create({
      title,
      description,
      price,
      image,
      stock,
      category,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}