// components/ActiveUsers.tsx
"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
}

const ActiveUsers = () => {
  const [users, setUsers] = useState<User[]>([]); // List of active users
  const [isOpen, setIsOpen] = useState(false); // Dropdown state

  useEffect(() => {
    // Set up WebSocket connection
    const socket = new WebSocket("wss://your-server.com/realtime-users");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "update-users") {
          setUsers(data.users); // Update users dynamically
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close(); // Cleanup WebSocket on component unmount
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      {/* Main button to display user count */}
      <div
        className="relative bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-medium">Active Users: {users.length}</span>
      </div>

      {/* Dropdown showing active usernames */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white w-64 max-h-64 overflow-y-auto rounded-md shadow-lg border border-gray-200 animate-slide-up">
          {users.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 text-gray-800 hover:bg-gray-50"
                >
                  {user.username}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500 text-center">No active users</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveUsers;
