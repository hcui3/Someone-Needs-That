import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import ProductDisplay from "../Components/ProductDisplay";
import MessageBoard from "../Components/MessageBoard";

const Product = () => {
  const { items } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (items.length > 0) {
      const prod = items.find((p) => p.id.toString() === productId);
      setProduct(prod);
      setLoading(false);
    }
  }, [productId, items]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProductDisplay product={product} />
      <MessageBoard product={product} />
    </div>
  );
};

export default Product;
