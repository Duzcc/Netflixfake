import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Head = "text-xs text-left text-main font-semibold px-6 py-2 uppercase";
const Text = "text-sm text-left leading-6 whitespace-nowrap px-5 py-3";

const Rows = (item, index, isUserTable, onEdit) => {
  return (
    <tr key={index}>
      {isUserTable ? (
        <>
          <td className={Text}>
            <div className="w-12 h-12 p-1 bg-dry border border-border rounded overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={item.image || "/images/user.png"}
                alt={item.fullName || "User"}
              />
            </div>
          </td>
          <td className={Text}>{item._id || "N/A"}</td>
          <td className={Text}>{item.createdAt?.slice(0, 10) || "N/A"}</td>
          <td className={Text}>{item.fullName}</td>
          <td className={Text}>{item.email}</td>
        </>
      ) : (
        <>
          <td className={`${Text} font-bold`}>{item.id || item._id || "N/A"}</td>
          <td className={Text}>{item.release_date || item.createdAt?.slice(0, 10) || "N/A"}</td>
          <td className={Text}>{item.title || "Untitled"}</td>
        </>
      )}
      <td className={`${Text} float-right flex gap-2 items-center`}>
        <button
          onClick={() => onEdit(item)}
          className="border border-border bg-dry text-border rounded px-2 py-1 flex items-center gap-1"
        >
          Edit <FaEdit className="text-green-500" />
        </button>
        <button className="bg-subMain text-white rounded w-6 h-6 flex items-center justify-center">
          <MdDelete />
        </button>
      </td>
    </tr>
  );
};

function Table2({ data = [], users = false, onEdit = () => {} }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto border border-border divide-y divide-border">
        <thead className="bg-dryGray">
          <tr>
            {users ? (
              <>
                <th className={Head}>Image</th>
                <th className={Head}>ID</th>
                <th className={Head}>Date</th>
                <th className={Head}>Full Name</th>
                <th className={Head}>Email</th>
              </>
            ) : (
              <>
                <th className={Head}>ID</th>
                <th className={Head}>Date</th>
                <th className={Head}>Title</th>
              </>
            )}
            <th className={`${Head} text-end`}>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-main divide-y divide-border">
          {data.map((item, i) => Rows(item, i, users, onEdit))}
        </tbody>
      </table>
    </div>
  );
}

export default Table2;
