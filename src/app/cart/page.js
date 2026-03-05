// "use client";

// import { useCart } from "../components/CartContext";

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity } = useCart();

//   if (!Array.isArray(cart)) return null;

//   const totalAmount = cart.reduce(
//     (total, item) =>
//       total + (item.product?.price || 0) * item.quantity,
//     0
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

//       {cart.length === 0 ? (
//         <p className="text-gray-500">Your cart is empty</p>
//       ) : (
//         cart.map((item) => (
//           <div
//             key={item.product?._id}
//             className="bg-white p-4 shadow mb-3 flex justify-between items-center rounded"
//           >
//             <div>
//               <h2 className="font-semibold">
//                 {item.product?.title}
//               </h2>

//               <p className="text-gray-600">
//                 Rs. {item.product?.price}
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() =>
//                   updateQuantity(
//                     item.product._id,
//                     item.quantity - 1
//                   )
//                 }
//                 disabled={item.quantity <= 1}
//                 className="bg-gray-200 px-2 py-1 rounded disabled:opacity-50"
//               >
//                 -
//               </button>

//               <span className="px-3 py-1 border rounded">
//                 {item.quantity}
//               </span>

//               <button
//                 onClick={() =>
//                   updateQuantity(
//                     item.product._id,
//                     item.quantity + 1
//                   )
//                 }
//                 className="bg-gray-200 px-2 py-1 rounded"
//               >
//                 +
//               </button>

//               <button
//                 onClick={() =>
//                   removeFromCart(item.product._id)
//                 }
//                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {cart.length > 0 && (
//         <div className="mt-6 text-right font-bold text-xl">
//           Total: Rs. {totalAmount}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!Array.isArray(cart)) return null;

  // ✅ Calculate total safely
  const totalAmount = cart.reduce((total, item) => {
    const price = item?.product?.price || 0;
    const quantity = item?.quantity || 0;
    return total + price * quantity;
  }, 0);

  const handleDecrease = (productId, quantity) => {
    if (quantity <= 1) return;
    updateQuantity(productId, quantity - 1);
  };

  const handleIncrease = (productId, quantity) => {
    updateQuantity(productId, quantity + 1);
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    router.push("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Your cart is empty 🛒
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product?._id}
                className="bg-white p-4 shadow rounded flex justify-between items-center"
              >
                {/* Product Info */}
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.product?.title}
                  </h2>
                  <p className="text-gray-600">
                    Rs. {item.product?.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleDecrease(
                        item.product._id,
                        item.quantity
                      )
                    }
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="px-4 py-1 border rounded">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleIncrease(
                        item.product._id,
                        item.quantity
                      )
                    }
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(item.product._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Total Section */}
          <div className="mt-8 bg-gray-100 p-6 rounded shadow">
            <div className="flex justify-between text-xl font-semibold mb-4">
              <span>Total Amount:</span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}