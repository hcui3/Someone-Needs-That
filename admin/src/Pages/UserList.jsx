import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  const { users, listUsers, usersLoading } = useContext(ShopContext);

  if (usersLoading) {
    return <div>Loading...</div>;
  }

  const removeUser = async (userId) => {
    const payload = JSON.stringify({ userId: userId });

    try {
      const response = await fetch("https://3zv038w5s4.execute-api.us-east-1.amazonaws.com/Stage/removeuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        listUsers();
      } else {
        console.error("Failed to delete user:", responseData.error);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const viewUserItems = (userId) => {
    localStorage.setItem("userId", userId);
    navigate("/useritems");
  };

  const viewUserSales = (userId) => {
    localStorage.setItem("userId", userId);
    navigate("/usersales");
  };

  return (
    <div className="px-4 mb-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">Control panel for user accounts and activity details.</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Available Items
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Sales History
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, idx) => (
                  <tr key={idx}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{user.userId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.userName}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.userEmail}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500">
                      <button className="text-green-600 hover:text-green-800" onClick={() => viewUserItems(user.userId)}>
                        View
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500">
                      <button className="text-green-600 hover:text-green-800" onClick={() => viewUserSales(user.userId)}>
                        View
                      </button>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button className="text-red-500 hover:text-red-700" onClick={() => removeUser(user.userId)}>
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

export default UserList;
