import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const History = () => {
  const { allOrders, toggleExpand, expandedItemId, AllordersLoading } = useContext(ShopContext);

  if (AllordersLoading) {
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
          <h1 className="text-base font-semibold leading-6 text-gray-900">Transaction History</h1>
          <p className="mt-2 text-sm text-gray-700">Overview of all transactions including IDs, items, prices, buyer details, and dates.</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Item ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Item Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Buyer ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Seller ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Seller Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Transaction Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{order.transactionId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.itemId}</td>
                    <td
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      style={{
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: expandedItemId === order.itemId ? "normal" : "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleExpand(order.itemId)}
                    >
                      {order.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatPrice(order.price)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.userId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.sellerId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.sellerEmail}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(order.transactionDate)}</td>
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

export default History;
