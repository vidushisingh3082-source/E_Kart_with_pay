import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { registerUser } from "@/store/auth-slice";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";

function AuthRegister() {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit() {
    dispatch(registerUser(formData)).then((res) => {
      if (res.payload?.success) {
        toast.success("Registered successfully, please login");
        navigate("/auth/login");
      } else {
        toast.error(res.payload?.message || "Registration failed");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="mb-1 text-2xl font-bold">Create account</h1>
      <p className="mb-6 text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-medium underline">
          Sign in
        </Link>
      </p>
      <CommonForm
        formControls={registerFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Register"
      />
    </div>
  );
}

export default AuthRegister;
