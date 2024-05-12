import { Route, Routes, useLocation } from "react-router-dom";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import WishList from "./Pages/WishList";
import SellList from "./Pages/SellList";
import Post from "./Pages/Post";
import Profile from "./Pages/Profile";
import ContentWrapper from "./Components/ContentWrapper";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { categories } from "./Assets/data";
import Success from "./Pages/Success";
import Username from "./Pages/Username";
import Password from "./Pages/Password";
import Cancel from "./Pages/Cancel";
import Landing from "./Pages/Landing";
import Orders from "./Pages/Orders";

const App = () => {
  const location = useLocation();
  const showFooter = !["/profile", "/"].includes(location.pathname);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <ContentWrapper>
        <Routes location={location}>
          {categories.map(({ path, banner, description, category }) => (
            <Route key={path} path={path} element={<ShopCategory category={category} banner={banner} description={description} />} />
          ))}
          <Route path="/" element={<Landing />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/selllist" element={<SellList />} />
          <Route path="/post" element={<Post />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/changeusername" element={<Username />} />
          <Route path="/changepassword" element={<Password />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
        {showFooter && <Footer />}
      </ContentWrapper>
    </div>
  );
};

export default App;
