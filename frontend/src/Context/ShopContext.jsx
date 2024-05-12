/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const ShopContext = createContext(null);

const defaultImage = "https://images.squarespace-cdn.com/content/v1/613125f4adffd34a635f8e53/1f201222-fd83-476c-8257-7ec2ce56eef2/wokx2.jpg";

const ShopContextProvider = (props) => {
  const [items, setItems] = useState([]);
  const [wishitem, setWishitem] = useState([]);
  const [open, setOpen] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem("auth-token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [wishitemsLoading, setWishitemsLoading] = useState(true);

  const listItems = async () => {
    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listitems");

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (response.status === 200) {
        const result = responseBody.results.map((product) => ({
          id: product.itemId,
          name: product.name,
          category: product.category,
          image: product.image || defaultImage,
          price: product.price,
          description: product.description,
          userId: product.userId,
          itemDate: product.itemDate,
          sold: product.sold,
        }));
        setAllItems(result);
        let filteredItems = result.filter((item) => item.sold === 0);
        setItems(filteredItems);
        setItemsLoading(false);
      } else {
        console.error("Failed to fetch data:", responseData.error);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const updateAuthData = () => {
    const newAuthToken = localStorage.getItem("auth-token") || null;
    const newUsername = localStorage.getItem("username") || null;

    setAuthToken(newAuthToken);
    setUsername(newUsername);
  };

  const listWishitems = async () => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("Login required");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    const payload = JSON.stringify({ userId });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listwishitems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        setWishitem(responseBody.wishitems);
        setWishitemsLoading(false);
      } else {
        console.error("Failed to list wishitems", responseData.error);
      }
    } catch (error) {
      console.error("Failed to list wishitems", error);
    }
  };

  const listOrders = async () => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      alert("Login required");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    const payload = JSON.stringify({ userId });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        setOrders(responseBody.results);
        setOrdersLoading(false);
      } else {
        console.error("Failed to list orders", responseData.error);
      }
    } catch (error) {
      console.error("Failed to list orders", error);
    }
  };

  useEffect(() => {
    listItems();

    if (authToken) {
      listWishitems();
      listOrders();
    } else {
      setWishitem([]);
      setOrders([]);
    }
  }, [authToken]);

  const postWhishlist = async (itemId) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("login required");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = String(decodedToken.user.id);

    const payload = JSON.stringify({ userId, itemId });

    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/postwishitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        listWishitems();
      } else {
        console.error("Post wishlist error:", responseData.error);
      }
    } catch (error) {
      console.error("Post wishlist error:", error);
    }
  };

  const contextValue = {
    items,
    wishitem,
    postWhishlist,
    listItems,
    open,
    setOpen,
    authToken,
    username,
    updateAuthData,
    defaultImage,
    orders,
    listOrders,
    allItems,
    ordersLoading,
    itemsLoading,
    wishitemsLoading,
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
