import React, { useEffect, useState } from "react";
import MainModal from "./MainModal";
import { Input } from "../UsedInputs";

function CategoryModal({ modalOpen, setModalOpen, category }) {
  const [title, setTitle] = useState("");

  // Khi modal mở lại với dữ liệu mới
  useEffect(() => {
    setTitle(category?.title || "");
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
    };

    if (!payload.title) return;

    try {
      if (category) {
        // Gọi API update
        await fetch(`https://your-api.com/api/categories/${category._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        console.log("Category updated:", payload);
      } else {
        // Gọi API create
        await fetch(`https://your-api.com/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        console.log("Category created:", payload);
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to submit category:", err);
    }
  };

  return (
    <MainModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="inline-block sm:w-4/5 md:w-3/5 lg:w-2/5 w-full align-middle p-10 overflow-y-auto h-full bg-main text-white rounded-2xl border border-border">
        <h2 className="text-3xl font-bold">{category ? "Update" : "Create"} Category</h2>

        <form className="flex flex-col gap-6 text-left mt-6" onSubmit={handleSubmit}>
          <Input
            label="Category Name"
            placeholder="Action"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            bg={false}
          />

          <button
            type="submit"
            className="w-full flex-rows gap-4 py-3 text-lg transitions hover:bg-dry border-2 border-subMain rounded bg-subMain text-white"
          >
            {category ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </MainModal>
  );
}

export default CategoryModal;
