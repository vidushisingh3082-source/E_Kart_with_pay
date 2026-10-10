import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { getFeatureImages } from "@/store/common-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

function ShoppingHome() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList, aboutUsImageList } = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({}));
    dispatch(getFeatureImages("home-banner"));
    dispatch(getFeatureImages("about-us"));
  }, [dispatch]);

  const bannerImage = featureImageList?.[0]?.image;
  const aboutImage = aboutUsImageList?.[0]?.image;

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-sand sm:h-72 md:h-96 lg:h-[29rem]">
        {bannerImage ? (
          <img src={bannerImage} alt="banner" className="h-full w-full object-cover object-center" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sand via-ivory to-sand" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ivory">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-ivory/80">New Season</p>
          <h1 className="font-display text-4xl italic sm:text-6xl">The Autumn Edit</h1>
          <p className="mt-3 max-w-md text-sm text-ivory/80">
            Timeless pieces, made to last. Explore the new arrivals.
          </p>
          <Link
            to="/shop/listing"
            className="mt-6 rounded-full border border-ivory px-6 py-2 text-xs font-medium uppercase tracking-widest text-ivory transition hover:bg-ivory hover:text-ink"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between border-b border-ink/10 pb-4">
          <h2 className="font-display text-3xl text-ink">Featured Products</h2>
          <span className="hidden text-xs uppercase tracking-wider text-ink/50 sm:block">
            Curated for you
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {productList.slice(0, 8).map((product) => (
            <ShoppingProductTile key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="border-t border-ink/10 bg-sand/40">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-wine">Our Story</p>
            <h2 className="font-display text-3xl text-ink">About E-Kart</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              We started E-Kart with a simple idea: quality clothing shouldn't be complicated
              to find. Every piece we carry is chosen for how it looks, how it fits, and how
              long it lasts.
            </p>
            <Link
              to="/shop/about-us"
              className="mt-5 inline-block text-xs font-medium uppercase tracking-widest text-ink underline underline-offset-4 hover:text-wine"
            >
              Read our full story
            </Link>
          </div>
          <div className="h-64 w-full overflow-hidden rounded-md bg-gradient-to-br from-wine/20 via-sand to-ink/10 md:h-72">
            {aboutImage && (
              <img src={aboutImage} alt="About E-Kart" className="h-full w-full object-cover" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingHome;