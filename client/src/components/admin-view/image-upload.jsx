import { UploadCloud } from "lucide-react";
import api from "@/api/axios";

function AdminImageUpload({ imageUrl, setImageUrl, uploading, setUploading }) {
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("my_file", file);

    try {
      const res = await api.post("/admin/products/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.result.url);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 p-6 text-sm text-slate-500 hover:bg-slate-50">
        {imageUrl ? (
          <img src={imageUrl} alt="preview" className="h-32 w-32 object-cover" />
        ) : (
          <>
            <UploadCloud size={24} />
            {uploading ? "Uploading..." : "Click to upload image"}
          </>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}

export default AdminImageUpload;
