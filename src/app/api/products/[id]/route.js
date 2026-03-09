// import { connectDB } from "@/lib/db";
// import Product from "@/models/Product";
// import { NextResponse } from "next/server";

// // GET product by ID
// export async function GET(request, context) {
//   try {
//     await connectDB();
//     const id = context?.params?.id || request.url.split("/").pop();
//     const product = await Product.findById(id).populate("category");

//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }
//     return NextResponse.json(product, { status: 200 });
//     } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// // UPDATE product
// export async function PUT(request, context) {
//   try {
//     await connectDB();
//     const id = context?.params?.id || request.url.split("/").pop();
//     const { title, description, price, image, stock, category } =
//       await request.json(); 
//     const product = await Product.findByIdAndUpdate(
//       id,   
//         { title, description, price, image, stock, category },
//         { new: true }
//     );

//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }   
//     return NextResponse.json(product, { status: 200 });
//     } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// // DELETE product

// export async function DELETE(request, context) {
//   try {
//     await connectDB();
//     const id = context?.params?.id || request.url.split("/").pop();
//     const product = await Product.findByIdAndDelete(id);

//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }
//     return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// GET product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    console.log("=== Fetching Product ===");
    console.log("Product ID:", id);

    const product = await Product.findById(id).populate("category");

    if (!product) {
      console.log("Product not found:", id);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("Product found:", product);
    
    // ✅ Return in format expected by ProductDetailPage
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


// UPDATE product
export async function PUT(request, context) {
  try {
    await connectDB();
    const id = context?.params?.id || request.url.split("/").pop();
    const { title, description, price, image, stock, category } =
      await request.json(); 

    const product = await Product.findByIdAndUpdate(
      id,
      { title, description, price, image, stock, category },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }   
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, context) {
  try {
    await connectDB();
    const id = context?.params?.id || request.url.split("/").pop();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}