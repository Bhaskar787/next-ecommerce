"use client";

import { useState } from "react";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      const { paymentUrl, params } = data;

      // Create hidden form for eSewa submission
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;
      form.style.display = "none";

      // Add all parameters
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment Error:", err);
      setError(err.message || "Payment failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">eSewa Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md outline-green-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded-md outline-green-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (NPR)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              className="w-full p-2 border rounded-md outline-green-500"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#41a124] hover:bg-[#368a1e]"
            }`}
          >
            {isSubmitting ? "Processing..." : "Pay with eSewa"}
          </button>
        </form>
      </div>
    </div>
  );
}