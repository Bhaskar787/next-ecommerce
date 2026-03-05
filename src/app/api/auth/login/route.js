// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { signToken } from "@/lib/jwt";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, password } = await req.json();

//     const user = await User.findOne({ email });
//     if (!user)
//       return Response.json({ error: "User not found" }, { status: 400 });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match)
//       return Response.json({ error: "Wrong password" }, { status: 400 });

//     const token = signToken(user);
//     return Response.json({ token });
//   } catch (error) {
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }


import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Wrong password" }, { status: 400 });

    return NextResponse.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}