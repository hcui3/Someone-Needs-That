import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "admin",
    password: "",
  });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const { email, password } = formData;

    if (!password) {
      toast.error("Please enter a password.");
      return;
    }

    const payload = JSON.stringify({ email, password });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        const { token } = responseBody;

        localStorage.setItem("admin-token", token);

        setFormData({
          password: "",
        });

        navigate("/itemlist");
      } else if (responseData.statusCode === 401) {
        toast.error("Invalid password.");
      } else {
        console.error("Login failed:", responseData.error);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-800 h-screen overflow-hidden flex items-center justify-center">
        <div className="bg-white lg:w-5/12 md:6/12 w-10/12 shadow-3xl">
          <div className="p-12 md:p-20">
            <h2 className="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Administrator Login</h2>

            <div className="flex items-center text-lg mb-6 md:mb-8">
              <svg className="absolute ml-3" viewBox="0 0 24 24" width="24">
                <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z" />
              </svg>
              <input
                id="password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
                type="password"
                autoComplete="current-password"
                required
                className="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full"
                placeholder="Password"
              />
            </div>
            <button
              onClick={() => {
                login();
              }}
              type="submit"
              className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full hover:from-gray-900 hover:to-gray-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
