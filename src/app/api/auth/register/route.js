// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password } = await req.json();

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return Response.json({ error: "User exists" }, { status: 400 });

//     const hashed = await bcrypt.hash(password, 10);
//     await User.create({ name, email, password: hashed });

//     return Response.json({ message: "User created" });
//   } catch (error) {
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }

// //get all users
// export async function GET() {
//   try {
//     await connectDB();
//     const users = await User.find().select("-password").sort({ createdAt: -1 });
//     return Response.json(users);
//   }
//   catch (error) {
//     return Response.json({ error: "Server error" }, { status: 500 });
//   } 
// }



// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// // 🔹 CREATE USER
// export async function POST(req) {
//   try {
//     await connectDB();

//     const { name, email, password, role } = await req.json();

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User exists" },
//         { status: 400 }
//       );
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email,
//       password: hashed,
//       role: role || "user",
//     });

//     return NextResponse.json(
//       { message: "User created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }



// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password } = await req.json();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Return user data (without password)
//     return NextResponse.json({
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });

//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }

// }

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: "User exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    return NextResponse.json({
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}