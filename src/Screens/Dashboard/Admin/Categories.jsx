import React, { useEffect, useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import Table2 from "../../../Components/Table2";
import SideBar from "../SideBar";
import CategoryModal from "../../../Components/Modals/CategoryModal";

// Giả sử bạn có API riêng để lấy category
const API_URL = "https://your-api.com/api/categories"; // Thay bằng API thực tế

function Categories() {
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const OnEditFunction = (category) => {
    setCategory(category);
    setModalOpen(true);
  };

  useEffect(() => {
    if (modalOpen === false) {
      setCategory(null);
      fetchCategories(); // Làm mới danh sách sau khi thêm/sửa
    }
  }, [modalOpen]);

  return (
    <SideBar>
      <CategoryModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        category={category}
      />
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-2">
          <h2 className="text-xl font-bold">Categories</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-subMain flex-rows gap-4 font-medium transitions hover:bg-main border border-subMain text-white py-2 px-4 rounded"
          >
            <HiPlusCircle /> Create
          </button>
        </div>

        <Table2
          data={categories}
          users={false}
          OnEditFunction={OnEditFunction}
        />
      </div>
    </SideBar>
  );
}

export default Categories;
