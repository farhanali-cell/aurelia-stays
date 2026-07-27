import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import stripePromise from "../stripe";

const CheckoutForm = ({ bookingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      setSuccess(true);
      setTimeout(() => navigate(`/booking-confirmation/${bookingId}`), 1500);
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && (
        <div className="bg-danger/10 text-danger text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-success/10 text-success text-sm rounded-lg px-4 py-2">
          Payment successful! Redirecting...
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 bg-ink text-parchment py-3 rounded-lg font-medium hover:bg-gold-dark hover:text-ink transition-all active:scale-95 disabled:opacity-50"
      >
        <CreditCard size={18} />
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Payment = () => {
  const { bookingId } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const hasCreatedIntent = useRef(false);

  useEffect(() => {
    if (hasCreatedIntent.current) return;
    hasCreatedIntent.current = true;

    const createIntent = async () => {
      try {
        const res = await api.post("/payments/create-intent/", {
          booking_id: bookingId,
        });
        setClientSecret(res.data.client_secret);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.detail ||
            "Failed to initialize payment.",
        );
      } finally {
        setLoading(false);
      }
    };
    createIntent();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-md mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={20} className="text-gold-dark" />
            <h1 className="font-display text-xl text-ink">Secure Payment</h1>
          </div>
          <p className="text-xs text-muted mb-6">
            Encrypted checkout powered by Stripe
          </p>

          {loading && (
            <p className="text-muted text-sm">Setting up payment...</p>
          )}
          {error && <p className="text-danger text-sm">{error}</p>}

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm bookingId={bookingId} />
            </Elements>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
