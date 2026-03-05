// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [cart, setCart] = useState([]);

//   /* =====================================
//      ✅ LOAD CART WHEN USER CHANGES
//   ===================================== */
//   useEffect(() => {
//     const loadCart = async () => {
//       const userId = user?._id || user?.id;
//       console.log("CartContext: current user", user);

//       if (!userId) {
//         setCart([]);
//         return;
//       }

//       try {
//         const res = await fetch(`/api/cart/${userId}`);
//         const data = await res.json();

//         if (data.success) {
//           setCart(data.cart);
//         } else {
//           setCart([]);
//         }
//       } catch (err) {
//         console.log("Cart fetch error:", err);
//         setCart([]);
//       }
//     };

//     loadCart();
//   }, [user]);


//   /* =====================================
//      ✅ ADD TO CART
//   ===================================== */
//   const addToCart = async (productId) => {
//     const userId = user?._id || user?.id;
//     if (!userId || userId === "undefined" || userId === "null")
//       return alert("Please login first");

//     try {
//       console.log("addToCart: sending", { userId, productId });
//       const res = await fetch(`/api/cart`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           productId,
//         }),
//       });

//       const data = await res.json();
//       console.log("addToCart response", res.status, data);

//       if (data.success) {
//         setCart(data.cart);
//       } else {
//         alert(data.message || "Add to cart failed");
//       }
//     } catch (error) {
//       console.error("Add to cart error:", error);
//       alert("Add to cart error: " + (error.message || error));
//     }
//   };


//   /* =====================================
//      ✅ UPDATE QUANTITY
//   ===================================== */
//   const updateQuantity = async (productId, quantity) => {
//     const userId = user?._id || user?.id;
//     if (!userId || userId === "undefined" || userId === "null") return;

//     try {
//       console.log("updateQuantity: sending", { userId, productId, quantity });
//       const res = await fetch(`/api/cart/${userId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productId,
//           quantity,
//         }),
//       });

//       const data = await res.json();
//       console.log("updateQuantity response", res.status, data);

//       if (data.success) {
//         setCart(data.cart);
//       } else {
//         alert(data.message || "Update cart failed");
//       }
//     } catch (error) {
//       console.error("Update cart error:", error);
//       alert("Update cart error: " + (error.message || error));
//     }
//   };


//   /* =====================================
//      ✅ REMOVE FROM CART
//   ===================================== */
//   const removeFromCart = async (productId) => {
//     const userId = user?._id || user?.id;
//     if (!userId || userId === "undefined" || userId === "null") return;

//     try {
//       console.log("removeFromCart: sending", { userId, productId });
//       const res = await fetch(
//         `/api/cart/${userId}?productId=${productId}`,
//         { method: "DELETE" }
//       );

//       const data = await res.json();
//       console.log("removeFromCart response", res.status, data);

//       if (data.success) {
//         setCart(data.cart);
//       } else {
//         alert(data.message || "Remove from cart failed");
//       }
//     } catch (error) {
//       console.error("Remove cart error:", error);
//       alert("Remove cart error: " + (error.message || error));
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         updateQuantity,
//         removeFromCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };



// export const useCart = () => useContext(CartContext);


"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      const userId = user?._id;
      if (!userId) {
        setCart([]);
        return;
      }

      const res = await fetch(`/api/cart/${userId}`);
      const data = await res.json();

      if (data.success) setCart(data.cart);
      else setCart([]);
    };

    loadCart();
  }, [user]);

  const addToCart = async (productId) => {
    const userId = user?._id;
    if (!userId) return alert("Login first");

    await fetch(`/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });

    const res = await fetch(`/api/cart/${userId}`);
    const data = await res.json();
    setCart(data.cart);
  };

  const updateQuantity = async (productId, quantity) => {
    const userId = user?._id;
    if (!userId) return;

    const res = await fetch(`/api/cart/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json();
    if (data.success) setCart(data.cart);
  };

  const removeFromCart = async (productId) => {
    const userId = user?._id;
    if (!userId) return;

    const res = await fetch(
      `/api/cart/${userId}?productId=${productId}`,
      { method: "DELETE" }
    );

    const data = await res.json();
    if (data.success) setCart(data.cart);
  };

  const clearCart = async () => {
    const userId = user?._id;
    if (!userId) return;

    await fetch(`/api/cart/${userId}`, {
      method: "DELETE",
    });

    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);