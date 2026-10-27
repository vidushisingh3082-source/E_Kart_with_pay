import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureImages } from "@/store/common-slice";

function AuthLayout() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(getFeatureImages("home-banner"));
  }, [dispatch]);

  const bgImage = featureImageList?.[0]?.image;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory p-4">
      {/* Website banner as background, faded */}
      {bgImage ? (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sand via-ivory to-sand" />
      )}

      {/* Light color wash on top so the card stays readable */}
      <div className="absolute inset-0 bg-ivory/50" />

      {/* The form card */}
      <div className="relative w-full max-w-md rounded-lg border border-ink/10 bg-white/90 p-8 shadow-lg backdrop-blur-sm">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;