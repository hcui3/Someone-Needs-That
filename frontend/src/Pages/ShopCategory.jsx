/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item";
import Filter from "../Components/Filter";

const ShopCategory = ({ banner, category, description }) => {
  const { items, itemsLoading } = useContext(ShopContext);
  const [updatedProducts, setUpdatedProducts] = useState(items);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (itemsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[77vh]">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{banner}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">{description}</p>
      </div>
      <Filter updatedProducts={updatedProducts} setUpdatedProducts={setUpdatedProducts} />
      <div className="bg-white">
        <div className="mx-auto max-w-[1563px] overflow-hidden sm:px-6 lg:px-8">
          <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {updatedProducts.map((product) => {
              if (!category || category === product.category) {
                return <Item key={product.id} id={product.id} name={product.name} image={product.image} price={product.price} />;
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
