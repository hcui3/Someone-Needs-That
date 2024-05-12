import { sidebarData } from "../Assets/data";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { open } = useContext(ShopContext);
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav
      className={`fixed top-12 left-0 h-full bg-white overflow-x-hidden border shadow-md z-40 ease-linear duration-300 ${open ? "w-36" : "w-12"} `}
    >
      {sidebarData.map(({ path, icon: Icon, label }) => (
        <NavLink
          to={path}
          key={path}
          className={({ isActive }) =>
            `flex items-center w-full p-3 transition-colors duration-200 rounded hover:bg-gray-200 ${
              isActive ? "bg-gray-200 text-gray-600" : "text-gray-500"
            }`
          }
        >
          <div className="flex justify-center">
            <Icon className="w-6 h-6" />
          </div>
          {open && <span className="font-abhaya-libre font-medium text-[17px] tracking-tight ml-4">{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default Sidebar;
