import { useContext, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item";

const WishList = () => {
  const { items, wishitem, authToken, itemsLoading } = useContext(ShopContext);

  const wishlistProducts = useMemo(() => {
    if (itemsLoading) return [];

    return items.filter((product) => wishitem.includes(product.id));
  }, [items, wishitem, itemsLoading]);

  if (itemsLoading) {
    return <div>Loading...</div>;
  }

  if (!authToken) {
    return (
      <div className="bg-white min-h-[77vh] flex justify-center">
        <h1 className="text-2xl font-medium text-gray-900 mt-36">Please log in to view your wishlist.</h1>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-[77vh] mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Wishlist</h1>

      <div className="bg-white mx-auto max-w-[1563px] overflow-hidden sm:px-6 lg:px-8 mt-16">
        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {wishlistProducts.map((product, i) => (
            <Item key={i} id={product.id} name={product.name} image={product.image} price={product.price} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default WishList;
