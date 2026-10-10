import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import AdminImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SECTIONS = [
  { type: "home-banner", label: "Homepage Banners", stateKey: "featureImageList" },
  { type: "about-us", label: "About Us Page Image", stateKey: "aboutUsImageList" },
  { type: "contact-us", label: "Contact Us Page Image", stateKey: "contactUsImageList" },
];

function ImageSection({ type, label, stateKey }) {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.common[stateKey]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(getFeatureImages(type));
  }, [dispatch, type]);

  function handleUpload() {
    if (!imageUrl) return toast.error("Please upload an image first");
    dispatch(addFeatureImage({ image: imageUrl, type })).then((res) => {
      if (res.payload?.success) {
        toast.success("Image added");
        setImageUrl("");
        dispatch(getFeatureImages(type));
      }
    });
  }

  function handleDelete(id) {
    dispatch(deleteFeatureImage(id)).then((res) => {
      if (res.payload?.success) toast.success("Image removed");
    });
  }

  return (
    <div className="mb-10">
      <h2 className="mb-4 text-lg font-semibold">{label}</h2>
      <div className="mb-4 max-w-sm">
        <AdminImageUpload
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          uploading={uploading}
          setUploading={setUploading}
        />
        <Button className="w-full" onClick={handleUpload}>
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((f) => (
          <div key={f._id} className="relative">
            <img src={f.image} alt={label} className="h-32 w-full rounded object-cover" />
            <button
              onClick={() => handleDelete(f._id)}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
              aria-label="Delete image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {images.length === 0 && <p className="text-sm text-slate-500">No image uploaded yet.</p>}
      </div>
    </div>
  );
}

function AdminFeatures() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Site Images</h1>
      {SECTIONS.map((section) => (
        <ImageSection key={section.type} {...section} />
      ))}
    </div>
  );
}

export default AdminFeatures;
