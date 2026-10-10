import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusOptions = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered", "Cancelled"];

function AdminOrders() {
  const dispatch = useDispatch();
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  function handleViewDetails(id) {
    setOpenId(id);
    dispatch(getOrderDetailsForAdmin(id));
  }

  function handleStatusChange(id, orderStatus) {
    dispatch(updateOrderStatus({ id, orderStatus })).then(() => {
      toast.success("Order status updated");
      dispatch(getAllOrdersForAdmin());
    });
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Order ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3">
                  <div className="relative h-12 w-10">
                    <img
                      src={order.cartItems?.[0]?.image}
                      alt={order.cartItems?.[0]?.title}
                      className="h-12 w-10 rounded object-cover"
                    />
                    {order.cartItems?.length > 1 && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                        +{order.cartItems.length - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3">#{order._id.slice(-6)}</td>
                <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="p-3">₹{order.totalAmount}</td>
                <td className="p-3 uppercase">
                  {order.paymentMethod} ·{" "}
                  <span className={order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="rounded border px-2 py-1 text-xs capitalize"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <Button variant="outline" className="!py-1 text-xs" onClick={() => handleViewDetails(order._id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!openId} onOpenChange={() => setOpenId(null)} title="Order Details">
        {orderDetails && (
          <div className="space-y-3 text-sm">
            <p>
              <strong>Order ID:</strong> {orderDetails._id}
            </p>
            <p>
              <strong>Status:</strong> {orderDetails.orderStatus}
            </p>
            <p>
              <strong>Method:</strong> {orderDetails.paymentMethod?.toUpperCase()}
            </p>
            <p>
              <strong>Payment:</strong> {orderDetails.paymentStatus}
            </p>
            <div>
              <strong>Items:</strong>
              <div className="mt-2 space-y-2">
                {orderDetails.cartItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="h-12 w-10 rounded object-cover" />
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
    </div>
  );
}

export default AdminOrders;
