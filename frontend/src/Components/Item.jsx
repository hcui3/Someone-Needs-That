/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Item = ({ id, image, name, price }) => {
  const { postWhishlist, wishitem, wishitemsLoading } = useContext(ShopContext);
  const isWishlisted = wishitem.includes(id);
  const clickWish = () => {
    postWhishlist(id);
  };

  if (wishitemsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative border-b border-r border-gray-200 p-4 flex flex-col justify-between sm:p-6">
      <div className="overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
        <Link to={`/product/${id}`}>
          <img src={image} className="h-full w-full object-cover object-center" />
        </Link>
      </div>
      <div className="pb-3 pt-10 text-center flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 mb-4">{name}</h3>
        <div className="flex justify-between items-center mt-auto mx-3">
          <p className="text-base font-medium text-gray-900">${price}</p>
          <button onClick={clickWish} className="text-xl">
            {isWishlisted ? <FaHeart className="text-red-600" /> : <FaRegHeart className="text-red-600" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
