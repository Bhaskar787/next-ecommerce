// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (data.token) {
//       localStorage.setItem("token", data.token);
//       router.push("/admin");
//     } else {
//       setError(data.error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="p-6 border rounded w-96">
//         <h1 className="text-xl font-bold mb-4">Login</h1>
//         {error && <p className="text-red-500">{error}</p>}
//         <input className="border p-2 w-full mb-2" placeholder="Email"
//           value={email} onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" className="border p-2 w-full mb-2"
//           placeholder="Password"
//           value={password} onChange={(e) => setPassword(e.target.value)} />
//         <button className="bg-blue-500 text-white p-2 w-full rounded"
//           onClick={handleLogin}>Login</button>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthContext";


export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Login failed");

      loginUser(data.user); // ✅ Use API returned user
      router.push("/");
    } catch {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-3">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}