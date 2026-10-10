import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureImages } from "@/store/common-slice";

function AboutUs() {
  const dispatch = useDispatch();
  const { aboutUsImageList } = useSelector((state) => state.common);
  const image = aboutUsImageList?.[0]?.image;

  useEffect(() => {
    dispatch(getFeatureImages("about-us"));
  }, [dispatch]);

  return (
    <div>
      <div className="border-b border-ink/10 bg-sand/40 py-16 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-wine">Our Story</p>
        <h1 className="font-display text-4xl italic text-ink">About E-Kart</h1>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          {image ? (
            <img src={image} alt="About E-Kart" className="h-72 w-full rounded-md object-cover" />
          ) : (
            <div className="h-72 w-full rounded-md bg-gradient-to-br from-wine/20 via-sand to-ink/10" />
          )}
          <div>
            <h2 className="font-display text-2xl text-ink">Who We Are</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              E-Kart started with a simple belief — that shopping for clothes online should feel
              as good as finding the perfect piece in a favorite boutique. We curate a small,
              considered selection instead of an endless catalog, so every product you see has
              earned its place.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-lg text-ink">Quality First</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              We work with brands and makers who care about fabric, fit, and finish — not just
              trends.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">Honest Pricing</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              No inflated "discounts." What you see is a fair price for something built to
              last.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink">Customer First</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Easy sizing, simple returns, and real people behind support — always just a
              message away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
