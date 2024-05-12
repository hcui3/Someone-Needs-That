/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("admin-token"));
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [AllordersLoading, setAllOrdersLoading] = useState(true);

  const updateAuthData = () => {
    setAdminToken(localStorage.getItem("admin-token"));
  };

  const toggleExpand = (itemId) => {
    if (expandedItemId === itemId) {
      setExpandedItemId(null);
    } else {
      setExpandedItemId(itemId);
    }
  };

  const removeItem = async (itemId) => {
    const payload = JSON.stringify({ itemId: itemId });
    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/removeitem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        listItems();
      } else {
        console.error("Failed to delete item:", responseData.error);
      }
    } catch (error) {
      console.error("Delete item error:", error);
    }
  };

  const listUsers = async () => {
    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        setUsers(responseBody.results);
        setUsersLoading(false);
      } else {
        console.error("Failed to list users:", responseData.error);
      }
    } catch (error) {
      console.error("List users error:", error);
    }
  };

  const listItems = async () => {
    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listitems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        setItems(responseBody.results);
        setItemsLoading(false);
      } else {
        console.error("Failed to list items", responseData.error);
      }
    } catch (error) {
      console.error("Failed to list items", error);
    }
  };

  const listAllOrders = async () => {
    try {
      const response = await fetch("https://r9kn1o6u62.execute-api.us-east-1.amazonaws.com/Stage/listallorders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const responseBody = JSON.parse(responseData.body);

      if (responseData.statusCode === 200) {
        setAllOrders(responseBody.results);
        setAllOrdersLoading(false);
      } else {
        console.error("Failed to list orders.");
      }
    } catch (error) {
      console.error("List orders error:", error);
    }
  };

  useEffect(() => {
    listUsers();
    listItems();
    listAllOrders();
  }, []);

  const contextValue = {
    adminToken,
    updateAuthData,
    removeItem,
    listUsers,
    users,
    items,
    listItems,
    allOrders,
    toggleExpand,
    expandedItemId,
    usersLoading,
    itemsLoading,
    AllordersLoading,
  };
  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
