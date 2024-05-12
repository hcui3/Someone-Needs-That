import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const { authToken, updateAuthData } = useContext(ShopContext);
  const navigate = useNavigate();

  if (!authToken) {
    return (
      <div className="bg-white h-[70vh] flex justify-center">
        <h1 className="text-2xl font-medium text-gray-900 mt-36">Please log in to view your selling list.</h1>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("username");
    updateAuthData();
    navigate("/");
  };

  const userId = jwtDecode(authToken).user.id;

  const username = () => {
    navigate("/changeusername");
  };

  const password = () => {
    navigate("/changepassword");
  };

  const deleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
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
          handleLogout();
        } else {
          console.error("Failed to delete account:", responseData.error);
        }
      } catch (error) {
        console.error("Delete account error:", error);
      }
    } else {
      console.log("Account deletion cancelled.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Profile Options</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <button
          onClick={() => {
            username(navigate);
          }}
          type="submit"
          className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 mb-4"
        >
          Change Username
        </button>
        <button
          onClick={() => {
            password(navigate);
          }}
          type="submit"
          className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 mb-4"
        >
          Change Password
        </button>
        <button
          onClick={() => {
            deleteAccount();
          }}
          type="submit"
          className="flex w-full justify-center rounded-md bg-red-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
