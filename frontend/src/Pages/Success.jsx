import { useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { listOrders } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleBack = () => {
    listOrders();
    navigate("/all");
  };

  const transaction = async () => {
    const itemId = localStorage.getItem("itemId");

    const token = localStorage.getItem("auth-token");
    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    const payload = JSON.stringify({ itemId, userId });

    try {
      const response = await fetch("https://3zv038w5s4.execute-api.us-east-1.amazonaws.com/Stage/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();
      if (responseData.statusCode !== 200) {
        console.error("Transaction failed:", responseData);
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  useEffect(() => {
    transaction();
  }, []);

  return (
    <>
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14">
          <div className="mx-auto max-w-2xl py-32 sm:py-48">
            <div className="text-center">
              <svg viewBox="0 0 24 24" className="text-green-600 w-14 h-14 mx-auto">
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <h3 className="text-3xl font-bold mt-10">Payment Done!</h3>
              <p className="text-xl font-normal mt-6 text-gray-500">Thank you for completing your secure online payment.</p>
              <p className="text-xl font-normal mt-2">Have a great day!</p>
              <div className="mt-8 flex justify-center h-12 relative">
                <div className="flex absolute ">
                  <button
                    className="bg-green-600 hover:bg-green-700 rounded text-lg py-1.5 px-8 text-white shadow-md font-medium"
                    onClick={() => {
                      handleBack();
                    }}
                  >
                    GO BACK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
