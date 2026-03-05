// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { useAuth } from "../components/AuthContext";
// import { useCart } from "../components/CartContext";
// import { useRouter } from "next/navigation";

// export default function CheckoutPage() {
//   const { cart } = useCart();
//   const { user, loading: authLoading } = useAuth(); // ✅ get loading
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   // ✅ Redirect ONLY after auth check completes
//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push("/login");
//     }
//   }, [authLoading, user, router]);

//   // 🧮 Safe total calculation
//   const totalAmount = useMemo(() => {
//     return cart.reduce((total, item) => {
//       const price = Number(item?.product?.price || 0);
//       const quantity = Number(item?.quantity || 0);
//       return total + price * quantity;
//     }, 0);
//   }, [cart]);

//   // 💳 Handle Payment
//   const handleEsewaPayment = async () => {
//     if (!user) return alert("Please login first.");
//     if (!cart || cart.length === 0)
//       return alert("Your cart is empty.");

//     try {
//       setLoading(true);

//       const res = await fetch("/api/payment/initiate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: totalAmount,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Payment initiation failed");
//       }

//       // Inside your handleEsewaPayment or handleSubmit
// const { paymentUrl, params } = data;

// const form = document.createElement("form");
// form.method = "POST";
// form.action = paymentUrl;

// // Loop through all params returned by the API
// Object.entries(params).forEach(([key, value]) => {
//   const input = document.createElement("input");
//   input.type = "hidden";
//   input.name = key;
//   input.value = value;
//   form.appendChild(input);
// });

// document.body.appendChild(form);
// form.submit();

//     } catch (error) {
//       alert(error.message || "Payment failed.");
//       setLoading(false);
//     }
//   };

//   // ✅ Prevent rendering while checking auth
//   if (authLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <p>Checking authentication...</p>
//       </div>
//     );
//   }

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto p-8 text-center">
//         <h1 className="text-2xl font-semibold mb-4">
//           Your cart is empty 🛒
//         </h1>
//         <button
//           onClick={() => router.push("/")}
//           className="bg-blue-600 text-white px-6 py-2 rounded"
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6">Checkout</h1>

//       <div className="grid md:grid-cols-2 gap-8">

//         {/* 🛒 Order Summary */}
//         <div className="bg-white p-6 shadow rounded">
//           <h2 className="text-xl font-semibold mb-4">
//             Order Summary
//           </h2>

//           {cart.map((item) => (
//             <div
//               key={item.product?._id}
//               className="flex justify-between mb-3"
//             >
//               <div>
//                 <p className="font-medium">
//                   {item.product?.title}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Qty: {item.quantity}
//                 </p>
//               </div>

//               <p>
//                 Rs. {(item.product?.price * item.quantity).toFixed(2)}
//               </p>
//             </div>
//           ))}

//           <hr className="my-4" />

//           <div className="flex justify-between font-bold text-lg">
//             <span>Total</span>
//             <span>Rs. {totalAmount.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* 💳 Payment Section */}
//         <div className="bg-white p-6 shadow rounded">
//           <h2 className="text-xl font-semibold mb-4">
//             Payment Method
//           </h2>

//           <p className="mb-6 text-gray-600">
//             Secure payment via eSewa
//           </p>

//           <button
//             onClick={handleEsewaPayment}
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
//           >
//             {loading ? "Redirecting..." : "Pay with eSewa"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const totalAmount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + (item.product?.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const handleEsewaPayment = async () => {
    if (!user) return alert("Login required");
    if (totalAmount <= 0) return alert("Cart is empty");

    try {
      setLoading(true);

      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      Object.entries(data.params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

      {cart.map((item) => (
        <div key={item.product._id} className="flex justify-between mb-2">
          <span>{item.product.title} x {item.quantity}</span>
          <span>Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="border-t mt-4 pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>Rs. {totalAmount.toFixed(2)}</span>
      </div>

      <button
        onClick={handleEsewaPayment}
        disabled={loading}
        className="w-full bg-green-600 text-white mt-6 py-3 rounded font-bold disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Pay with eSewa"}
      </button>
    </div>
  );
}