import React, { useEffect, useState } from "react";
import Table2 from "../../../Components/Table2";
import SideBar from "../SideBar";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (storedUser) {
      setUsers([storedUser]);
    }
  }, []);

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Users</h2>
        <Table2 data={users} users={true} />
      </div>
    </SideBar>
  );
}

export default Users;
