import React, { useEffect, useState } from "react";
import Table2 from "../../../Components/Table2";
import SideBar from "../SideBar";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
    setLoading(false);
  }, []);

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-white">Users</h2>
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
