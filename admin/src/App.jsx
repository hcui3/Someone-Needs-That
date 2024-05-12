import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ItemList from "./Pages/ItemList";
import UserList from "./Pages/UserList";
import History from "./Pages/History";
import UserItems from "./Pages/UserItems";
import UserSales from "./Pages/UserSales";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import ContentWrapper from "./Components/ContentWrapper";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Navbar open={open} setOpen={setOpen} />
        <Sidebar open={open} />
        <ContentWrapper open={open}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/itemlist" element={<ProtectedRoute element={<ItemList />} />} />
            <Route path="/userlist" element={<ProtectedRoute element={<UserList />} />} />
            <Route path="/history" element={<ProtectedRoute element={<History />} />} />
            <Route path="/useritems" element={<ProtectedRoute element={<UserItems />} />} />
            <Route path="/usersales" element={<ProtectedRoute element={<UserSales />} />} />
          </Routes>
        </ContentWrapper>
      </BrowserRouter>
    </div>
  );
};

export default App;
