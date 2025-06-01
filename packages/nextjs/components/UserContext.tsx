import React, { createContext, useContext, useState } from "react";

const demoUsers = [
  { name: "Alice", address: "0xF39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
  { name: "Bob", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
  { name: "Carol", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" },
];

const UserContext = createContext({
  users: demoUsers,
  currentUser: demoUsers[0],
  setCurrentUser: (user: typeof demoUsers[0]) => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(demoUsers[0]);
  return (
    <UserContext.Provider value={{ users: demoUsers, currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 