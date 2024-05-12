import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { XMarkIcon as XMarkIconOutline } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ShopContext } from "../Context/ShopContext";

const SellList = () => {
  const { authToken, listItems, allItems, itemsLoading } = useContext(ShopContext);

  if (!authToken) {
    return (
      <div className="bg-white h-[70vh] flex justify-center">
        <h1 className="text-2xl font-medium text-gray-900 mt-36">Please log in to view your selling list.</h1>
      </div>
    );
  }

  if (itemsLoading) {
    return <div>Loading...</div>;
  }

  const userId = jwtDecode(authToken).user.id;
  const userItemsForSale = allItems.filter((item) => item.userId == userId);

  const removeItem = async (itemId) => {
    const payload = JSON.stringify({ itemId: itemId });
    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/removeitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        listItems();
      } else {
        console.error("Delete item error:", responseData);
      }
    } catch (error) {
      console.error("Delete item error:", error);
    }
  };

  const timeSince = (date) => {
    const now = new Date();
    const itemDate = new Date(date);
    const secondsPast = (now.getTime() - itemDate.getTime()) / 1000;

    if (secondsPast < 60) {
      return parseInt(secondsPast) + " seconds ago";
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + " minutes ago";
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + " hours ago";
    }
    if (secondsPast <= 604800) {
      return parseInt(secondsPast / 86400) + " days ago";
    }
    if (secondsPast <= 2592000) {
      return parseInt(secondsPast / 604800) + " weeks ago";
    }
    if (secondsPast <= 31536000) {
      return parseInt(secondsPast / 2592000) + " months ago";
    }
    return parseInt(secondsPast / 31536000) + " years ago";
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 min-h-[77vh]">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Selling List</h1>
          <p className="mt-2 text-sm text-gray-700">
            A listing of all the items you have for sale, complete with details such as the item name, description, category, price, posting date, and
            status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link to="/post">
            <button
              type="button"
              className="block rounded-md bg-green-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800"
            >
              Add item
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {userItemsForSale.map((product, index) => (
                  <tr key={product.id || index} className="even:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{product.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{timeSince(product.itemDate)}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      {product.sold === 0 ? (
                        <button className="text-gray-500 hover:text-gray-700" onClick={() => removeItem(product.id)}>
                          <XMarkIconOutline className="h-5 w-5" />
                        </button>
                      ) : (
                        <p className="flex justify-end">
                          <span className="text-gray-500">Sold</span>
                          <CheckIcon className="h-5 w-5 ml-4 text-green-500" />
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellList;
