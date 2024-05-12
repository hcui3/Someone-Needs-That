import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const Username = () => {
  const { updateAuthData } = useContext(ShopContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: localStorage.getItem("username"),
    newUsername: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("username");
    updateAuthData();
    navigate("/");
  };

  const updateUsername = async () => {
    const { newUsername } = formData;
    const { username } = formData;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast.error("Login required");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    if (!newUsername.trim()) {
      toast.error("New username cannot be empty.");
      return;
    }

    const payload = JSON.stringify({ userId, newUsername, username });

    try {
      const response = await fetch("https://3zv038w5s4.execute-api.us-east-1.amazonaws.com/Stage/updateusername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        toast.success("Username successfully updated", {
          autoClose: 1000,
          onClose: () => {
            setFormData({
              username: newUsername,
              newUsername: "",
            });
            handleLogout();
          },
        });
      } else if (responseData.statusCode === 409) {
        toast.error("Username already exists.");
      } else {
        console.error("Username update error:", responseData);
      }
    } catch (error) {
      console.error("Username update error:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Change Username</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Current Username
              </label>
              <div className="mt-2">
                <input
                  name="username"
                  id="username"
                  value={formData.username}
                  readOnly
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium leading-6 text-gray-900">
                New Username
              </label>
              <div className="mt-2">
                <input
                  name="newUsername"
                  id="newUsername"
                  value={formData.newUsername}
                  onChange={changeHandler}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <button
            onClick={() => {
              updateUsername();
            }}
            type="submit"
            className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 mb-4"
          >
            Change
          </button>
          <Link to="/profile">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Back
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Username;
