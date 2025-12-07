import { Listbox, Transition } from "@headlessui/react";
import React, { useState, useEffect, Fragment } from "react";
import { FaAngleDown, FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getGenres } from "../Data/movieAPI";

const YearData = [
  { title: "Any Year" },
  { title: "2020 - 2024", range: [2020, 2024] },
  { title: "2010 - 2019", range: [2010, 2019] },
  { title: "2000 - 2009", range: [2000, 2009] },
  { title: "1990 - 1999", range: [1990, 1999] },
  { title: "1980 - 1989", range: [1980, 1989] },
];

const TimesData = [
  { title: "Any Duration" },
  { title: "< 90 min", range: [0, 90] },
  { title: "90 - 120 min", range: [90, 120] },
  { title: "120 - 150 min", range: [120, 150] },
  { title: "> 150 min", range: [150, 999] },
];

const RatesData = [
  { title: "Any Rating" },
  { title: "5 Star", value: 5 },
  { title: "4+ Star", value: 4 },
  { title: "3+ Star", value: 3 },
  { title: "2+ Star", value: 2 },
  { title: "1+ Star", value: 1 },
];

function Filters({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ title: "All Genres" });
  const [year, setYear] = useState(YearData[0]);
  const [times, setTimes] = useState(TimesData[0]);
  const [rates, setRates] = useState(RatesData[0]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        const formatted = data.map((genre) => ({
          id: genre.id,
          title: genre.name,
        }));
        setCategories([{ title: "All Genres" }, ...formatted]);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    onFilterChange?.({
      genreId: category?.id || null,
      yearRange: year?.range || null,
      timeRange: times?.range || null,
      rating: rates?.value || null,
    });
  }, [category, year, times, rates]);

  const clearAllFilters = () => {
    setCategory(categories[0] || { title: "All Genres" });
    setYear(YearData[0]);
    setTimes(TimesData[0]);
    setRates(RatesData[0]);
  };

  const hasActiveFilters =
    category?.id || year?.range || times?.range || rates?.value;

  const activeFilters = [];
  if (category?.id) activeFilters.push({ label: category.title, clear: () => setCategory(categories[0]) });
  if (year?.range) activeFilters.push({ label: year.title, clear: () => setYear(YearData[0]) });
  if (times?.range) activeFilters.push({ label: times.title, clear: () => setTimes(TimesData[0]) });
  if (rates?.value) activeFilters.push({ label: rates.title, clear: () => setRates(RatesData[0]) });

  const FilterItems = [
    {
      value: category,
      onChange: setCategory,
      items: categories,
      label: "Genre",
    },
    {
      value: year,
      onChange: setYear,
      items: YearData,
      label: "Year",
    },
    {
      value: times,
      onChange: setTimes,
      items: TimesData,
      label: "Duration",
    },
    {
      value: rates,
      onChange: setRates,
      items: RatesData,
      label: "Rating",
    },
  ];

  return (
    <div className="mb-8">
      {/* Filter Dropdowns */}
      <div className="glass-card backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {FilterItems.map((item, index) => (
            <Listbox key={index} value={item.value} onChange={item.onChange}>
              {({ open }) => (
                <div className="relative">
                  <Listbox.Label className="block text-text-secondary text-xs font-semibold mb-2 uppercase tracking-wider">
                    {item.label}
                  </Listbox.Label>
                  <Listbox.Button
                    className={`relative w-full glass-dark backdrop-blur-md text-white rounded-lg cursor-pointer py-3 pl-4 pr-10 text-left text-sm border-2 transition-all duration-300 ${open
                        ? "border-subMain shadow-glow"
                        : "border-white/20 hover:border-white/40"
                      }`}
                  >
                    <span className="block truncate font-medium">
                      {item.value.title}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaAngleDown
                        className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""
                          }`}
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Listbox.Options className="absolute z-50 mt-2 w-full glass-dark backdrop-blur-xl border-2 border-white/20 rounded-lg shadow-xl max-h-60 py-1 text-sm overflow-auto focus:outline-none">
                      {item.items.map((iterm, i) => (
                        <Listbox.Option
                          key={i}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active
                              ? "bg-subMain text-white"
                              : "text-white hover:bg-white/10"
                            }`
                          }
                          value={iterm}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? "font-semibold" : "font-normal"
                                  }`}
                              >
                                {iterm.title}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                                  <FaCheck className="h-4 w-4" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          ))}
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-white/10"
          >
            <button
              onClick={clearAllFilters}
              className="text-subMain hover:text-subMain/80 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <FaTimes />
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {activeFilters.map((filter, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={filter.clear}
                className="flex items-center gap-2 glass-dark backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 hover:border-subMain hover:bg-subMain/20 transition-all duration-300 group"
              >
                <span>{filter.label}</span>
                <FaTimes className="text-xs group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Filters;
