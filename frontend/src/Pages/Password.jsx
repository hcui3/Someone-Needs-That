import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const Password = () => {
  const navigate = useNavigate();
  const { updateAuthData } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const updatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast.error("Login required");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields must be filled out.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password is the same as the current password.");
      return;
    }

    const payload = JSON.stringify({ userId, currentPassword, newPassword });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/updatepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        toast.success("Password successfully updated", {
          autoClose: 1000,
          onClose: () => {
            setFormData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            handleLogout();
          },
        });
      } else if (responseData.statusCode === 401) {
        toast.error("Current password is incorrect.");
      } else {
        console.error("Password update error:", responseData.error);
      }
    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Change Password</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium leading-6 text-gray-900">
                Current Password
              </label>
              <div className="mt-2">
                <input
                  name="currentPassword"
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={changeHandler}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                New Password
              </label>
              <div className="mt-2">
                <input
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={changeHandler}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm New Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={changeHandler}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <button
            onClick={() => {
              updatePassword();
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

export default Password;
