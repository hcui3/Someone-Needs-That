/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { useCallback } from "react";

const MessageBoard = ({ product }) => {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    content: "",
  });
  const [loading, setLoading] = useState(true);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const postMessage = async () => {
    const { content } = formData;
    const itemId = String(product.id);
    const userName = localStorage.getItem("username");

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast.error("Login required");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    if (!content.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    const payload = JSON.stringify({ itemId, userId, content, userName });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/postmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        listMessages();
        setFormData({ content: "" });
      } else {
        console.error("Post message error:", responseData.error);
      }
    } catch (error) {
      console.error("Post message error:", error);
    }
  };

  const listMessages = useCallback(async () => {
    const itemId = String(product.id);

    const payload = JSON.stringify({ itemId });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listmessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        setMessages(responseBody.results);
        setLoading(false);
      } else {
        console.error("Failed to list messages", responseData.error);
      }
    } catch (error) {
      console.error("Failed to list messages", error);
    }
  }, [product.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  useEffect(() => {
    listMessages();
  }, [product.id, listMessages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="bg-white mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-start space-x-4">
          <div className="min-w-0 flex-1">
            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-700">
                <textarea
                  rows={3}
                  className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Leave a message..."
                  name="content"
                  type="text"
                  value={formData.content}
                  onChange={changeHandler}
                />

                <div className="py-2" aria-hidden="true">
                  <div className="py-px">
                    <div className="h-8" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex justify-end py-2 pl-3 pr-2">
                <button
                  onClick={postMessage}
                  className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flow-root">
          <div className="-my-12 divide-y divide-gray-200">
            {messages.map((message, idx) => (
              <div key={idx} className="py-6">
                <div className="flex items-center text-sm">
                  <p className="font-medium text-gray-900">{message.userName}</p>
                  <time className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{formatDate(message.messageDate)}</time>
                </div>
                <p className="mt-4 space-y-6 text-base italic text-gray-600">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBoard;
