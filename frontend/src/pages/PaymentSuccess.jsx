import { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";

function PaymentSuccess() {
  const [session, setSession] = useState(null);
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await axios.get(`/api/payment/session/${sessionId}`);
        setSession(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(
          "Error fetching case:",
          err.response?.data || err.message
        );
      }
    };

     

    fetchCase();
    
  }, [sessionId]);
  useEffect(() => {
    const donateToCase = async(caseId, amount) => {
      try {
        const res = await axios.patch(
          `/api/cases/${caseId}/donate`,
          { amount }
        );
        console.log(res.data);
      } catch (err) {
        console.error("Donation update failed:", err);
      }
    }
    console.log(session?.metadata?.caseId);
    donateToCase(session?.metadata?.caseId, session?.amount_total/100)

  },
  [session]);

  return (
    <div className="h-auto md:min-h-screen bg-[#F5F7FA] flex md:items-center justify-center py-10 px-6 md:py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-[12px_12px_24px_rgba(0,0,0,0.1),-12px_-12px_24px_rgba(255,255,255,0.9)] text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="lucide:circle-check" className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className=" text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2D3748] mb-3">Payment Successful!</h1>
          <p className="text-[var(--color-text-light)] mb-8">
            Thank you for your generosity
          </p>

          {/* Donation Details */}
          <div className="bg-[#F5F7FA] rounded-2xl p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-light)]">Amount donated</span>
                <span className="text-[#2D3748]">
                  ${parseFloat((session?.amount_total/100) || 1000).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-light)]">Supporting</span>
                <span className="text-[#2D3748] text-right max-w-[200px] truncate">
                  {session?.metadata?.caseTitle || "title"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-light)]">Date</span>
                <span className="text-[#2D3748]">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link to={`/case/${session?.metadata?.caseId}`} className="block">
              <button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-4 md:py-6 rounded-2xl border-2 border-gray-300 text-[var(--color-text-light)] hover:bg-gray-50 transition-all"
              >
                View Case Details
                <Icon icon="lucide:arrow-right" className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/" className="block">
              <button 
              className='w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white text-base font-medium hover:bg-transparent duration-300 hover:text-[var(--color-primary)] border border-[var(--color-primary)] px-6 py-3  rounded-2xl hover:cursor-pointer shadow-md hover:shadow-lg transition-all'
              >
                <Icon icon="lucide:home" className="w-5 h-5" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;


