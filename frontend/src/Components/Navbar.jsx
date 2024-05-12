import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useContext, useEffect } from "react";
import { navbarData } from "../Assets/data";
import { ShopContext } from "../Context/ShopContext";

const Navbar = () => {
  const { open, setOpen, authToken, username, updateAuthData } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebar = () => {
    setOpen(!open);
  };

  useEffect(() => {}, [authToken]);

  if (location.pathname === "/") {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    updateAuthData();
    navigate("/");
  };

  return (
    <nav className="fixed w-full h-12 flex justify-between shadow-lg px-2.5 z-50 bg-white">
      <div className="flex items-center">
        <button className={`mr-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${open ? "bg-gray-200" : ""}`} onClick={handleSidebar}>
          <FiMenu className="w-6 h-6" />
        </button>
        <Link to="/">
          <button className="flex">
            <img src="../../SNT.png" width={38} height={38} className="mx-2" />
            <p className="text-gray-800 text-[25px] max-sm:hidden font-abhaya-libre tracking-wider uppercase">
              Someone <span className="text-green-700">Needs That</span>
            </p>
          </button>
        </Link>
      </div>

      <div className="flex items-center">
        {navbarData.map(({ path, icon: Icon }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) => `mr-8 p-1 rounded-md hover:bg-gray-200 ${isActive ? "bg-gray-200 text-gray-950" : "text-gray-500"}`}
          >
            <Icon className="w-6 h-6 " />
          </NavLink>
        ))}
        <div className="font-fira-sans">
          {authToken ? (
            <>
              <div className="flex flex-1 items-center justify-end space-x-4 mr-2">
                <NavLink to="/profile">
                  <button className="text-lg text-gray-700 hover:text-gray-800">{username}</button>
                </NavLink>
                <span className="h-6 w-px bg-gray-300" />
                <button className=" text-lg text-gray-700 hover:text-gray-800" onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-1 items-center justify-end space-x-4 mr-2">
                <NavLink to="/login">
                  <button className="text-lg text-gray-700 hover:text-gray-800">Sign in</button>
                </NavLink>
                <span className="h-6 w-px bg-gray-300" />
                <NavLink to="/signup">
                  <button className="text-lg text-gray-700 hover:text-gray-800" onClick={handleLogout}>
                    Sign up
                  </button>
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
