import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  fetchAllAddresses,
  deleteAddress,
} from "@/store/shop/address-slice";
import { fetchAllOrdersByUser, fetchOrderDetails } from "@/store/shop/order-slice";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { addressFormControls } from "@/config";
import { toast } from "sonner";

function ShoppingAccount() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);
  const { orderList, orderDetails } = useSelector((state) => state.order);
  const [formData, setFormData] = useState({});
  const [tab, setTab] = useState("orders");
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
      dispatch(fetchAllOrdersByUser(user.id));
    }
  }, [user, dispatch]);

  function handleViewOrder(id) {
    setOpenOrderId(id);
    dispatch(fetchOrderDetails(id));
  }

  function handleAddAddress() {
    dispatch(addAddress({ ...formData, userId: user.id })).then((res) => {
      if (res.payload?.success) {
        toast.success("Address added");
        setFormData({});
        dispatch(fetchAllAddresses(user.id));
      }
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Account</h1>

      <div className="mb-6 flex gap-4 border-b">
        {["orders", "addresses"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-2 py-2 text-sm font-medium capitalize ${
              tab === t ? "border-slate-900" : "border-transparent text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="space-y-3">
          {orderList.length === 0 && <p className="text-slate-500">No orders yet.</p>}
          {orderList.map((order) => (
            <button
              key={order._id}
              onClick={() => handleViewOrder(order._id)}
              className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition hover:border-slate-400"
            >
              <div className="relative h-14 w-12 shrink-0">
                <img
                  src={order.cartItems?.[0]?.image}
                  alt={order.cartItems?.[0]?.title}
                  className="h-14 w-12 rounded object-cover"
                />
                {order.cartItems?.length > 1 && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                    +{order.cartItems.length - 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Order #{order._id.slice(-6)}</span>
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-slate-500">
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!openOrderId} onOpenChange={() => setOpenOrderId(null)} title="Order Details">
        {orderDetails && (
          <div className="space-y-3 text-sm">
            <p>
              <strong>Order ID:</strong> {orderDetails._id}
            </p>
            <p>
              <strong>Status:</strong> {orderDetails.orderStatus}
            </p>
            <p>
              <strong>Payment Method:</strong> {orderDetails.paymentMethod?.toUpperCase()}
            </p>
            <p>
              <strong>Payment Status:</strong> {orderDetails.paymentStatus}
            </p>
            <div>
              <strong>Items:</strong>
              <div className="mt-2 space-y-2">
                {orderDetails.cartItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="h-14 w-12 rounded object-cover" />
                    <span>
                      {item.title} {item.size ? `(${item.size})` : ""} × {item.quantity} — ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p>
              <strong>Address:</strong> {orderDetails.addressInfo?.address}, {orderDetails.addressInfo?.city} -{" "}
              {orderDetails.addressInfo?.pincode} ({orderDetails.addressInfo?.phone})
            </p>
            <p>
              <strong>Total:</strong> ₹{orderDetails.totalAmount}
            </p>
          </div>
        )}
      </Dialog>

      {tab === "addresses" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {addressList.map((addr) => (
              <div key={addr._id} className="flex items-start justify-between rounded-lg border p-3 text-sm">
                <div>
                  <p>{addr.address}</p>
                  <p className="text-slate-500">
                    {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-slate-500">{addr.phone}</p>
                </div>
                <Button
                  variant="destructive"
                  className="!px-2 !py-1 text-xs"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this address?")) {
                      dispatch(deleteAddress({ userId: user.id, addressId: addr._id }));
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Add New Address</h3>
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddAddress}
              buttonText="Add Address"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingAccount;
