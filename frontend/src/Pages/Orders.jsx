import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const Orders = () => {
  const { authToken, defaultImage, ordersLoading, orders } = useContext(ShopContext);

  if (!authToken) {
    return (
      <div className="bg-white h-[70vh] flex justify-center">
        <h1 className="text-2xl font-medium text-gray-900 mt-36">Please log in to view your order history.</h1>
      </div>
    );
  }

  if (ordersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white min-h-[77vh]">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Order history</h1>
        </div>

        <section className="mt-16">
          <div className="space-y-20">
            <table className="mt-4 w-full text-gray-500 sm:mt-6">
              <caption className="sr-only">Products</caption>
              <thead className="text-left text-sm text-gray-500">
                <tr>
                  <th scope="col" className="py-3 pr-8 text-base font-normal sm:w-2/5 lg:w-1/3">
                    Product
                  </th>
                  <th scope="col" className="hidden w-1/5 text-base py-3 pl-16 font-normal sm:table-cell">
                    Price
                  </th>
                  <th scope="col" className="w-0 py-3 text-base text-right font-normal">
                    Order Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                {orders.map((order) => (
                  <tr key={order.transactionId}>
                    <td className="py-5 pr-8">
                      <div className="flex items-center">
                        <img src={order.image || defaultImage} className="mr-6 h-16 w-16 rounded object-cover object-center" />
                        <div>
                          <div className="font-medium text-base text-gray-900">{order.name}</div>
                          <div className="text-base mt-1 sm:hidden">{order.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden text-base py-6 pl-16 sm:table-cell">${order.price}</td>
                    <td className="whitespace-nowrap text-base py-6 text-right font-medium text-green-800">
                      {new Date(order.transactionDate).toLocaleString("default", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Orders;
