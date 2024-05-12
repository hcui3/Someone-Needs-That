/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { ShopContext } from "../Context/ShopContext";
import { useContext } from "react";

const Navbar = ({ open, setOpen }) => {
  const { updateAuthData } = useContext(ShopContext);
  const toggle_side = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();
  const location = useLocation();

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
        <button
          onClick={() => {
            toggle_side();
          }}
          className={`mr-4 p-1 rounded-md cursor-pointer hover:bg-gray-200 ${open ? "bg-gray-200" : ""}`}
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <button className="flex">
          <img src="../../SNT.png" width={38} height={38} className="mx-2" />
          <p className="text-gray-800 text-[25px] max-sm:hidden font-abhaya-libre tracking-wider uppercase">
            Someone <span className="text-green-700 font-abhaya-libre">Needs That</span>
          </p>
        </button>
      </div>

      <div className="flex items-center">
        <div>
          <div className="flex flex-1 items-center justify-end space-x-4 mr-2">
            <button className="text-lg text-gray-700 hover:text-gray-800 font-fira-sans" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
