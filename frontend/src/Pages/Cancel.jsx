import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/all");
  };
  return (
    <>
      <div className="bg-white">
        <div className="relative isolate px-6 pt-14">
          <div className="mx-auto max-w-2xl py-32 sm:py-48">
            <div className="text-center">
              <svg viewBox="0 0 24 24" className="w-14 h-14 mx-auto">
                <circle cx="12" cy="12" r="10" fill="red" />
                <path fill="white" d="M9 9l6 6m0-6l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3 className="text-3xl font-bold mt-10">Payment Canceled</h3>
              <p className="text-xl font-normal mt-6 text-gray-500">Your payment was not completed. If this was an error, please try again.</p>
              <p className="text-xl font-normal mt-2">Have a great day!</p>
              <div className="mt-8 flex justify-center h-12 relative">
                <div className="flex absolute ">
                  <button
                    className="bg-red-600 hover:bg-red-700 rounded text-lg py-1.5 px-8 text-white shadow-md font-medium"
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

export default Cancel;
