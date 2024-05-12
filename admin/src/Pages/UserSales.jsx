import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const UserSales = () => {
  const navigate = useNavigate();
  const { allOrders, toggleExpand, expandedItemId, AllordersLoading } = useContext(ShopContext);

  if (AllordersLoading) {
    return <div>Loading...</div>;
  }

  const userId = localStorage.getItem("userId");
  const userOrders = allOrders.filter((order) => order.sellerId === userId);

  const redirect = () => {
    navigate("/userlist");
  };
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
          <h1 className="text-base font-semibold leading-6 text-gray-900">User Sales History</h1>
          <p className="mt-2 text-sm text-gray-700">A record of all items a user has successfully sold.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => redirect()}
            className="block rounded-md bg-green-800 px-6 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
            Back
          </button>
        </div>
      </div>
      {userOrders.length > 0 ? (
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
                      Date Sold
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Buyer ID
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {userOrders.map((userSale, idx) => (
                    <tr key={idx}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{userSale.itemId}</td>
                      <td
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: expandedItemId === userSale.itemId ? "normal" : "nowrap",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleExpand(userSale.itemId)}
                      >
                        {userSale.name}
                      </td>
                      <td
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: expandedItemId === userSale.itemId ? "normal" : "nowrap",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleExpand(userSale.itemId)}
                      >
                        {userSale.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{userSale.category}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatPrice(userSale.price)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(userSale.transactionDate)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{userSale.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-full pt-16 pb-20">
          <svg className="h-12 w-12 text-gray-400"></svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No Sales History Found</h3>
          <p className="mt-1 text-sm text-gray-500">This user hasn&apos;t made any sales yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserSales;
