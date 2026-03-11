"use client";

import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailureContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {message || "The transaction could not be completed. Please try again."}
        </p>

        {process.env.NODE_ENV === "development" && errorCode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-yellow-800 mb-1">
              Debug Info:
            </p>
            <p className="text-xs text-yellow-700 font-mono">{errorCode}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-[#41a124] hover:bg-[#368a1e] text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 py-2 px-6 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense>
      <FailureContent />
    </Suspense>
  );
}