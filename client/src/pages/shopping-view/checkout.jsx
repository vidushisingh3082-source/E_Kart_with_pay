import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllAddresses, addAddress } from "@/store/shop/address-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { createNewOrder, verifyPayment } from "@/store/shop/order-slice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CommonForm from "@/components/common/form";
import { addressFormControls } from "@/config";
import { CreditCard, MapPin, Plus, Truck } from "lucide-react";
import { toast } from "sonner";

const SHIPPING_FEE = 10;

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { addressList } = useSelector((state) => state.address);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // "cod" | "razorpay"

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
      dispatch(fetchCartItems(user.id));
    }
  }, [user, dispatch]);

  // Once addresses load, default-select the first saved one.
  useEffect(() => {
    if (!selectedAddressId && addressList.length > 0) {
      setSelectedAddressId(addressList[0]._id);
    }
    if (addressList.length === 0) {
      setShowAddressForm(true);
    }
  }, [addressList]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productId?.salePrice > 0 ? item.productId.salePrice : item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const total = subtotal + (cartItems.length > 0 ? SHIPPING_FEE : 0);

  function handleSaveNewAddress() {
    dispatch(addAddress({ ...addressFormData, userId: user.id })).then((res) => {
      if (res.payload?.success) {
        toast.success("Address added");
        setSelectedAddressId(res.payload.data._id);
        setAddressFormData({});
        setShowAddressForm(false);
        dispatch(fetchAllAddresses(user.id));
      } else {
        toast.error(res.payload?.message || "Could not save address");
      }
    });
  }

  function handlePlaceOrder() {
    if (!selectedAddressId) return toast.error("Please select or add a delivery address");
    if (cartItems.length === 0) return toast.error("Your cart is empty");
    const address = addressList.find((a) => a._id === selectedAddressId);

    const orderData = {
      userId: user.id,
      cartItems: cartItems.map((item) => ({
        productId: item.productId._id,
        title: item.productId.title,
        image: item.productId.image,
        price: item.productId.salePrice > 0 ? item.productId.salePrice : item.productId.price,
        size: item.size,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: address._id,
        address: address.address,
        city: address.city,
        pincode: address.pincode,
        phone: address.phone,
        notes: address.notes,
      },
      totalAmount: total,
      paymentMethod,
    };

    setIsPlacingOrder(true);
    dispatch(createNewOrder(orderData))
      .then((res) => {
        const payload = res.payload;
        if (!payload?.success) {
          toast.error(payload?.message || "Could not place order");
          setIsPlacingOrder(false);
          return;
        }

        if (payload.paymentMethod === "razorpay") {
          if (!window.Razorpay) {
            toast.error("Payment system failed to load. Please refresh and try again.");
            setIsPlacingOrder(false);
            return;
          }
          const rzp = new window.Razorpay({
            key: payload.keyId,
            order_id: payload.razorpayOrderId,
            amount: payload.amount,
            currency: payload.currency,
            name: "E_Kart",
            description: "Order payment",
            prefill: { name: user?.userName, email: user?.email, contact: address.phone },
            handler: async (response) => {
              const v = await dispatch(verifyPayment({ orderId: payload.orderId, ...response }));
              setIsPlacingOrder(false);
              if (v.payload?.success) {
                dispatch(fetchCartItems(user.id));
                navigate("/shop/payment-success", { state: { paymentMethod: "razorpay" } });
              } else {
                toast.error("Payment verification failed. If money was deducted, contact support.");
              }
            },
            modal: {
              ondismiss: () => {
                setIsPlacingOrder(false);
                toast.error("Payment cancelled");
              },
            },
          });
          rzp.on("payment.failed", () => {
            toast.error("Payment failed. Please try again.");
            setIsPlacingOrder(false);
          });
          rzp.open();
          return;
        }

        toast.success("Order placed! Pay by cash on delivery.");
        setIsPlacingOrder(false);
        dispatch(fetchCartItems(user.id));
        navigate("/shop/payment-success", { state: { paymentMethod: "cod" } });
      })
      .catch(() => setIsPlacingOrder(false));
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-[1.2fr_1fr]">
      {/* Delivery Information */}
      <div>
        <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-ink/40">Delivery</h2>
        <h1 className="mb-6 font-display text-2xl text-ink">Delivery Information</h1>

        {addressList.length > 0 && (
          <div className="mb-4 space-y-3">
            {addressList.map((addr) => (
              <label
                key={addr._id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition ${
                  selectedAddressId === addr._id
                    ? "border-ink bg-ink/[0.03]"
                    : "border-ink/10 hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mt-1 accent-ink"
                  checked={selectedAddressId === addr._id}
                  onChange={() => {
                    setSelectedAddressId(addr._id);
                    setShowAddressForm(false);
                  }}
                />
                <MapPin size={16} className="mt-0.5 shrink-0 text-ink/40" />
                <div>
                  <p className="text-ink">{addr.address}</p>
                  <p className="text-ink/50">
                    {addr.city} - {addr.pincode} · {addr.phone}
                  </p>
                  {addr.notes && <p className="text-ink/40">{addr.notes}</p>}
                </div>
              </label>
            ))}
          </div>
        )}

        {!showAddressForm ? (
          <button
            onClick={() => setShowAddressForm(true)}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink/60 hover:text-ink"
          >
            <Plus size={14} /> Add a new address
          </button>
        ) : (
          <Card className="p-5">
            <h3 className="mb-4 font-display text-lg text-ink">New Address</h3>
            <CommonForm
              formControls={addressFormControls}
              formData={addressFormData}
              setFormData={setAddressFormData}
              onSubmit={handleSaveNewAddress}
              buttonText="Save Address"
            />
            {addressList.length > 0 && (
              <button
                onClick={() => setShowAddressForm(false)}
                className="mt-3 text-xs uppercase tracking-wider text-ink/40 hover:text-ink"
              >
                Cancel
              </button>
            )}
          </Card>
        )}
      </div>

      {/* Cart Totals + Payment */}
      <div>
        <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-ink/40">Summary</h2>
        <h1 className="mb-6 font-display text-2xl text-ink">Cart Totals</h1>

        <Card className="p-5">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={`${item.productId?._id}-${item.size}`} className="flex items-center gap-3 text-sm">
                <img
                  src={item.productId?.image}
                  alt={item.productId?.title}
                  className="h-14 w-11 shrink-0 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-ink">{item.productId?.title}</p>
                  <p className="text-ink/40">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-medium text-ink">
                  ₹
                  {(
                    (item.productId?.salePrice > 0 ? item.productId.salePrice : item.productId?.price || 0) *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Shipping Fee</span>
              <span>₹{cartItems.length > 0 ? SHIPPING_FEE.toFixed(2) : "0.00"}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-display text-lg text-ink">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-ink/40">Payment Method</h2>
          <div className="space-y-3">
            {[
              { id: "razorpay", label: "Pay Online (Card / Netbanking / Wallet)", Icon: CreditCard },
              { id: "cod", label: "Cash on Delivery", Icon: Truck },
            ].map(({ id, label, Icon }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition ${
                  paymentMethod === id ? "border-ink bg-ink/[0.03]" : "border-ink/10 hover:border-ink/30"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="accent-ink"
                  checked={paymentMethod === id}
                  onChange={() => setPaymentMethod(id)}
                />
                <Icon size={14} className="text-ink/60" />
                <span className="uppercase tracking-wider text-ink">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          className="mt-6 w-full"
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0 || isPlacingOrder}
        >
          {isPlacingOrder ? "Processing..." : paymentMethod === "razorpay" ? "Pay Now" : "Place Order"}
        </Button>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
