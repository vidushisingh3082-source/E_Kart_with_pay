import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccess() {
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <CheckCircle2 size={56} className="text-green-600" />
      <h1 className="text-2xl font-bold">
        {paymentMethod === "cod" ? "Order Placed!" : "Payment Successful!"}
      </h1>
      <p className="text-slate-500">
        {paymentMethod === "cod"
          ? "Your order has been placed. Please keep the amount ready for cash on delivery."
          : "Your payment went through and your order has been placed."}
      </p>
      <Link to="/shop/account">
        <Button>View My Orders</Button>
      </Link>
    </div>
  );
}

export default PaymentSuccess;
