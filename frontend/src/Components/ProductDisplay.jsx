/* eslint-disable react/prop-types */
import { toast, ToastContainer } from "react-toastify";

const ProductDisplay = ({ product }) => {
  const getBaseUrl = () => {
    const baseUrl = window.location.origin;
    return baseUrl;
  };

  const baseUrl = getBaseUrl();
  const success = `${baseUrl}/success`;
  const cancel = `${baseUrl}/cancel`;

  const formData = {
    name: product.name,
    price: product.price,
    image: product.image,
    successUrl: success,
    cancelUrl: cancel,
  };

  const handleCheckout = async () => {
    localStorage.setItem("itemId", String(product.id));
    const itemId = localStorage.getItem("itemId");
    const { name, price, image, successUrl, cancelUrl } = formData;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast.error("Login required");
      return;
    }

    const payload = JSON.stringify({ itemId, name, price, image, successUrl, cancelUrl });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/transactionstripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        window.location.href = responseBody.url;
      } else if (responseData.statusCode === 409) {
        toast.error("Item has already been sold.", {
          onClose: () => {
            window.location.href = "/all";
          },
        });
      } else {
        console.error("Checkout failed:", responseData.error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="bg-gray-50">
      <ToastContainer />
      <main>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-10">
            <div className="lg:max-w-lg lg:self-start">
              <div className="mt-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
              </div>

              <section className="mt-8">
                <div className="flex items-center">
                  <p className="text-lg text-gray-900 sm:text-xl">${product.price}</p>
                </div>
                <div className="mt-8 space-y-6">
                  <p className="text-base text-gray-500">{product.description}</p>
                </div>
              </section>
            </div>

            <div className="mt-10 lg:ml-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
                <img src={product.image} alt={product.image} className="h-full w-full object-cover object-center" />
              </div>
            </div>

            {/* Purchase Button */}
            <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-end">
              <div className="mt-10">
                <button
                  onClick={handleCheckout}
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-700 px-8 py-3 text-base font-medium text-white hover:bg-green-800"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDisplay;
