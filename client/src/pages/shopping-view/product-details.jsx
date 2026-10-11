import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchAllFilteredProducts,
  clearProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-elements";
import StarRating from "@/components/common/star-rating";
import StarPicker from "@/components/common/star-picker";
import api from "@/api/axios";
import { toast } from "sonner";

const DEFAULT_SIZES = ["xs", "s", "m", "l", "xl"];

function ShoppingProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { productDetails, productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.review);

  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewValue, setReviewValue] = useState(0);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(productId));
    dispatch(getReviews(productId));
    setSelectedSize(null);
    window.scrollTo(0, 0);
    return () => dispatch(clearProductDetails());
  }, [productId, dispatch]);

  // Has this customer bought and received the product?
  useEffect(() => {
    if (user && user.role !== "admin") {
      api
        .get(`/shop/review/can-review/${productId}`)
        .then((res) => setCanReview(!!res.data.canReview))
        .catch(() => setCanReview(false));
    } else {
      setCanReview(false);
    }
  }, [productId, user]);

  useEffect(() => {
    if (productDetails?.category) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: { category: [productDetails.category] } })
      );
    }
  }, [productDetails?.category, dispatch]);

  if (!productDetails || productDetails._id !== productId) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-ink/50">Loading...</div>;
  }

  const product = productDetails;
  const availableSizes = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
  const onSale = product.salePrice > 0;
  const relatedProducts = productList
    .filter((p) => p._id !== product._id)
    .slice(0, 5);

  function handleAddToCart() {
    if (!user) return toast.error("Please login first");
    if (!selectedSize) return toast.error("Please select a size");
    dispatch(
      addToCart({ userId: user.id, productId: product._id, size: selectedSize, quantity: 1 })
    ).then(() => {
      toast.success("Added to cart");
      dispatch(fetchCartItems(user.id));
    });
  }

  function handleAddReview() {
    if (!user) return toast.error("Please login first");
    if (!reviewValue) return toast.error("Please select a star rating");
    dispatch(
      addReview({
        productId: product._id,
        userId: user.id,
        userName: user.userName,
        reviewMessage,
        reviewValue,
      })
    ).then((res) => {
      if (res.payload?.success) {
        toast.success(res.payload.updated ? "Your review was updated" : "Review added");
        setReviewMessage("");
        setReviewValue(0);
        dispatch(getReviews(product._id));
        dispatch(fetchProductDetails(product._id));
      } else {
        toast.error(res.payload?.message || "Could not add review");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-[120px_1fr_1fr] md:items-start">
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-md border border-ink/10">
            <img src={product.image} alt={product.title} className="h-28 w-full object-cover" />
          </div>
        </div>

        <div className="overflow-hidden rounded-md bg-sand">
          <img src={product.image} alt={product.title} className="h-[32rem] w-full object-cover" />
        </div>

        <div>
          <h1 className="font-display text-3xl text-ink">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.averageReview} />
            <span className="text-sm text-ink/50">({reviews.length})</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="font-display text-2xl text-ink">
              ₹{onSale ? product.salePrice : product.price}
            </span>
            {onSale && (
              <span className="text-sm text-ink/40 line-through">₹{product.price}</span>
            )}
          </div>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">
            {product.description}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-ink">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border px-3 text-xs font-medium uppercase transition ${
                    selectedSize === size
                      ? "border-ink bg-ink text-ivory"
                      : "border-slate-300 text-ink/80 hover:border-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="mt-6 w-full max-w-xs"
            onClick={handleAddToCart}
            disabled={product.totalStock === 0}
          >
            {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <div className="mt-6 max-w-xs space-y-1 border-t border-ink/10 pt-4 text-xs text-ink/50">
            <p>100% Original product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-2xl border-t border-ink/10 pt-8">
        <h3 className="mb-4 font-display text-xl text-ink">Reviews</h3>
        <div className="mb-6 max-h-52 space-y-4 overflow-y-auto">
          {reviews.length === 0 && <p className="text-sm text-ink/50">No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r._id}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ink">{r.userName}</span>
                <StarRating rating={r.reviewValue} />
              </div>
              <p className="text-sm text-ink/60">{r.reviewMessage}</p>
            </div>
          ))}
        </div>

        {!user && (
          <p className="text-sm text-ink/50">Login to rate and review this product.</p>
        )}

        {user && user.role === "admin" && (
          <p className="text-sm text-ink/50">Admins can't rate or review products.</p>
        )}

        {user && user.role !== "admin" && !canReview && (
          <p className="rounded-md border border-ink/10 bg-sand p-3 text-sm text-ink/60">
            You can rate and review this product only after you have bought it.
          </p>
        )}

        {user && user.role !== "admin" && canReview && (
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Rate this product</p>
            <StarPicker value={reviewValue} onChange={setReviewValue} />
            <div className="mt-3">
              <Textarea
                placeholder="Write a review (optional)..."
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
              />
            </div>
            <Button className="mt-3" onClick={handleAddReview}>
              Submit Review
            </Button>
            <p className="mt-2 text-xs text-ink/40">
              Reviewed this before? Submitting again updates your old review.
            </p>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-ink/10 pt-10">
          <h2 className="mb-8 text-center font-display text-2xl text-ink">
            RELATED <span className="font-bold not-italic">PRODUCTS</span>
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {relatedProducts.map((p) => (
              <ShoppingProductTile key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingProductDetails;