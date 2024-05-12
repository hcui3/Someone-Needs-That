/* eslint-disable react/prop-types */
import { Fragment, useContext, useMemo, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { IoIosFunnel, IoIosArrowDown } from "react-icons/io";
import { ShopContext } from "../Context/ShopContext";
import { filters } from "../Assets/data";

const Filter = ({ setUpdatedProducts }) => {
  const sortOptions = ["Newest", "Price: Low to High", "Price: High to Low"];
  const classNames = (...classes) => classes.filter(Boolean).join(" ");

  const { items } = useContext(ShopContext);
  const [activeFilters, setActiveFilters] = useState({ price: null });
  const [sortOption, setSortOption] = useState("Newest");

  const handleFilterChange = (value) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      price: prevFilters.price === value ? null : value,
    }));
  };

  const handleSortChange = (optionName) => {
    setSortOption(optionName);
  };

  const results = useMemo(() => {
    let filtered = items;

    if (activeFilters.price) {
      const [minStr, maxStr] = activeFilters.price.split("-");
      const minPrice = parseInt(minStr, 10);
      const maxPrice = maxStr === "+" ? Infinity : parseInt(maxStr, 10);
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        return price >= minPrice && price <= maxPrice;
      });
    }

    filtered = filtered.sort((a, b) => {
      if (sortOption === "Price: Low to High") {
        return a.price - b.price;
      } else if (sortOption === "Price: High to Low") {
        return b.price - a.price;
      } else {
        return b.id - a.id;
      }
    });

    return filtered.map((product, index) => ({ ...product, order: index }));
  }, [items, activeFilters, sortOption]);

  useEffect(() => {
    setUpdatedProducts(results);
  }, [results, sortOption, setUpdatedProducts]);

  const clearFilters = () => {
    setActiveFilters({ price: null });
  };

  return (
    <Disclosure as="section" className="grid items-center border-b border-t border-gray-200">
      <div className="relative col-start-1 row-start-1 py-4">
        <div className="mx-auto flex max-w-[1563px] space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
          <div>
            <Disclosure.Button className="group flex items-center font-medium text-gray-700">
              <IoIosFunnel className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              <p>Filters</p>
            </Disclosure.Button>
          </div>
          <div className="pl-6">
            <button type="button" className="text-gray-500" onClick={clearFilters}>
              Clear all
            </button>
          </div>
        </div>
      </div>

      <Disclosure.Panel className="border-t border-gray-200 pb-10 pt-6">
        <div className="mx-auto max-w-[1500px] px-4 text-sm sm:px-6 lg:px-8">
          <fieldset>
            <legend className="block font-medium">Price</legend>
            <div className="mt-4 ml-4 flex space-x-4">
              {filters.price.map((filter) => (
                <div key={filter.value} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={activeFilters.price === filter.value}
                    onChange={() => handleFilterChange(filter.value)}
                    className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                  <label className="ml-3 min-w-0 flex-1 text-gray-600">{filter.label}</label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </Disclosure.Panel>

      <div className="col-start-1 row-start-1 py-4">
        <div className="mx-auto flex max-w-[1563px] justify-end px-4 sm:px-6 lg:px-8">
          <Menu as="div" className="relative inline-block">
            <div className="flex">
              <Menu.Button className="group inline-flex items-start justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <IoIosArrowDown className="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <Menu.Item key={option}>
                      {({ active }) => (
                        <button
                          className={classNames(
                            sortOption === option ? "font-medium text-gray-900" : "text-gray-500",
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 w-full text-left text-sm"
                          )}
                          onClick={() => handleSortChange(option)}
                        >
                          {option}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </Disclosure>
  );
};

export default Filter;
