import React, { useEffect, useState } from "react";
import Table2 from "../../../Components/Table2";
import SideBar from "../SideBar";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://your-api.com/api/users"); // Thay URL phù hợp
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Users</h2>
        {loading ? (
          <p className="text-white">Loading users...</p>
        ) : (
          <Table2 data={users} users={true} />
        )}
      </div>
    </SideBar>
  );
}

export default Users;
