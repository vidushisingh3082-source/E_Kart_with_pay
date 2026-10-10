import { Link } from "react-router-dom";
import { Card, CardContent, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/common/star-rating";

function ShoppingProductTile({ product }) {
  const onSale = product.salePrice > 0;

  return (
    <Card className="flex flex-col overflow-hidden bg-white">
      <Link to={`/shop/product/${product._id}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {onSale && <Badge className="absolute left-3 top-3">Sale</Badge>}
        {product.totalStock === 0 && (
          <Badge className="absolute right-3 top-3 bg-ink/70">Out of Stock</Badge>
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] uppercase tracking-wider text-ink/50">
          {product.category} · {product.brand}
        </p>
        <Link to={`/shop/product/${product._id}`}>
          <h3 className="truncate font-display text-base text-ink hover:underline">
            {product.title}
          </h3>
        </Link>
        <StarRating rating={product.averageReview} />
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className={onSale ? "text-sm text-ink/40 line-through" : "font-display text-lg"}>
            ₹{product.price}
          </span>
          {onSale && <span className="font-display text-lg text-wine">₹{product.salePrice}</span>}
        </div>
        <Link to={`/shop/product/${product._id}`}>
          <Button className="mt-3 w-full">
            {product.totalStock === 0 ? "View Details" : "Select Size"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default ShoppingProductTile;
