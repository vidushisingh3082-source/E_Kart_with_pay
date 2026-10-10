import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { loginUser } from "@/store/auth-slice";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";

function AuthLogin() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit() {
    dispatch(loginUser(formData)).then((res) => {
      if (res.payload?.success) {
        toast.success("Logged in successfully");
        navigate(res.payload.user?.role === "admin" ? "/admin/dashboard" : "/shop/home");
      } else {
        toast.error(res.payload?.message || "Login failed");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">Sign in</h1>
      <p className="mb-6 text-sm text-slate-500">
        Don't have an account?{" "}
        <Link to="/auth/register" className="font-medium underline">
          Register
        </Link>
      </p>
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Sign In"
      />
    </div>
  );
}

export default AuthLogin;
