import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const ItemList = () => {
  const { removeItem, items, toggleExpand, expandedItemId, itemsLoading } = useContext(ShopContext);

  if (itemsLoading) {
    return <div>Loading...</div>;
  }

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="px-4 mb-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Item Summary</h1>
          <p className="mt-2 text-sm text-gray-700">List of items with their status and transaction details.</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Item ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Seller ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date Posted
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{item.itemId}</td>
                    <td
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      style={{
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: expandedItemId === item.itemId ? "normal" : "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleExpand(item.itemId)}
                    >
                      {item.name}
                    </td>
                    <td
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: expandedItemId === item.itemId ? "normal" : "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleExpand(item.itemId)}
                    >
                      {item.description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.category}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatPrice(item.price)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.userId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(item.itemDate)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm" style={{ color: item.sold === 1 ? "#ef4444" : "#10b981" }}>
                      {item.sold === 1 ? "Sold" : "Available"}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        className={`text-sm ${
                          item.sold === 1 ? "text-gray-500 hover:text-gray-500 cursor-not-allowed" : "text-red-500 hover:text-red-700"
                        }`}
                        onClick={() => item.sold === 0 && removeItem(item.itemId)}
                        disabled={item.sold === 1}
                      >
                        Delete
                      </button>
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

export default ItemList;
