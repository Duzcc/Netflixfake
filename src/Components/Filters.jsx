import { Listbox, Transition } from "@headlessui/react";
import React, { useState, useEffect, Fragment } from "react";
import { FaAngleDown, FaCheck } from "react-icons/fa";
import { getGenres } from "../Data/movieAPI"; // <- nhớ đã import

const YearData = [
  { title: "Sort By Year" },
  { title: "1700 - 1800", range: [1700, 1800] },
  { title: "1800 - 1900", range: [1800, 1900] },
  { title: "1900 - 2000", range: [1900, 2000] },
  { title: "2000 - 2010", range: [2000, 2010] },
  { title: "2010 - 2030", range: [2010, 2030] },
];

const TimesData = [
  { title: "Sort By Hours" },
  { title: "1 - 5 Hours", range: [60, 300] },
  { title: "5 - 10 Hours", range: [300, 600] },
  { title: "10 - 15 Hours", range: [600, 900] },
  { title: "15 - 20 Hours", range: [900, 1200] },
];

const RatesData = [
  { title: "Sort By Rates" },
  { title: "1 Star", value: 1 },
  { title: "2 Star", value: 2 },
  { title: "3 Star", value: 3 },
  { title: "4 Star", value: 4 },
  { title: "5 Star", value: 5 },
];

function Filters({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ title: "Category" });
  const [year, setYear] = useState(YearData[0]);
  const [times, setTimes] = useState(TimesData[0]);
  const [rates, setRates] = useState(RatesData[0]);

  // Load genres từ TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        const formatted = data.map((genre) => ({
          id: genre.id,
          title: genre.name,
        }));
        setCategories([{ title: "Category" }, ...formatted]);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Trigger callback mỗi khi có thay đổi
  useEffect(() => {
    onFilterChange?.({
      genreId: category?.id || null,
      yearRange: year?.range || null,
      timeRange: times?.range || null,
      rating: rates?.value || null,
    });
  }, [category, year, times, rates]);

  const FilterItems = [
    {
      value: category,
      onChange: setCategory,
      items: categories,
    },
    {
      value: year,
      onChange: setYear,
      items: YearData,
    },
    {
      value: times,
      onChange: setTimes,
      items: TimesData,
    },
    {
      value: rates,
      onChange: setRates,
      items: RatesData,
    },
  ];

  return (
    <div className="my-6 bg-dry border text-dryGray border-gray-800 grid md:grid-cols-4 grid-cols-2 lg:gap-12 gap-2 rounded p-6">
      {FilterItems.map((item, index) => (
        <Listbox key={index} value={item.value} onChange={item.onChange}>
          <div className="relative">
            <Listbox.Button className="relative border border-gray-800 w-full text-white bg-main rounded-lg cursor-default py-4 pl-6 pr-10 text-left text-xs">
              <span className="block truncate">{item.value.title}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
                <FaAngleDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-800 text-dryGray rounded-md shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {item.items.map((iterm, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-subMain text-white" : "text-main"
                      }`
                    }
                    value={iterm}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncated ${
                            selected ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {iterm.title}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaCheck className="h-3 w-3" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      ))}
    </div>
  );
}

export default Filters;
