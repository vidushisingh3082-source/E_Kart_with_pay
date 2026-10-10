import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "@/store/admin/products-slice";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import CommonForm from "@/components/common/form";
import AdminImageUpload from "@/components/admin-view/image-upload";
import { addProductFormElements } from "@/config";
import { toast } from "sonner";

function AdminProducts() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function openAddDialog() {
    setEditingId(null);
    setFormData({});
    setImageUrl("");
    setOpen(true);
  }

  function openEditDialog(product) {
    setEditingId(product._id);
    setFormData(product);
    setImageUrl(product.image);
    setOpen(true);
  }

  function handleSubmit() {
    const payload = { ...formData, image: imageUrl };

    const action = editingId
      ? editProduct({ id: editingId, formData: payload })
      : addProduct(payload);

    dispatch(action).then((res) => {
      if (res.payload?.success) {
        toast.success(editingId ? "Product updated" : "Product added");
        setOpen(false);
        dispatch(fetchAllProducts());
      } else {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openAddDialog}>Add Product</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {productList.map((product) => (
          <div key={product._id} className="rounded-lg border bg-white p-3">
            <img src={product.image} alt={product.title} className="mb-2 h-32 w-full rounded object-cover" />
            <p className="truncate text-sm font-medium">{product.title}</p>
            <p className="text-xs text-slate-500">₹{product.price}</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="flex-1 !py-1 text-xs" onClick={() => openEditDialog(product)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1 !py-1 text-xs"
                onClick={() => dispatch(deleteProduct(product._id)).then(() => toast.success("Deleted"))}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title={editingId ? "Edit Product" : "Add Product"}>
        <AdminImageUpload
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          uploading={uploading}
          setUploading={setUploading}
        />
        <CommonForm
          formControls={addProductFormElements}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText={editingId ? "Update" : "Add"}
        />
      </Dialog>
    </div>
  );
}

export default AdminProducts;
