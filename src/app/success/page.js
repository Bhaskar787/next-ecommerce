"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_uuid");
  const amount = searchParams.get("amount");
  const status = searchParams.get("status");

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your transaction has been completed successfully.
        </p>

        {transactionId && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">Transaction ID</p>
              <button
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Transaction ID"
              >
                {copied ? (
                  <span className="text-green-600 text-sm">Copied!</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-lg font-mono font-semibold text-gray-900 break-all">
              {transactionId}
            </p>

            {amount && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  NPR {amount}
                </p>
              </div>
            )}

            {status && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-sm font-semibold text-green-600">
                  {status}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#41a124] hover:bg-[#368a1e] text-white py-3 px-6 rounded-lg font-semibold transition-colors shadow-lg"
          >
            <ArrowRight className="h-5 w-5" />
            Continue Shopping
          </Link>

          <Link
            href="/payment"
            className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Make Another Payment
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}