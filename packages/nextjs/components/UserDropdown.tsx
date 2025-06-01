import { useUser } from "./UserContext";

export default function UserDropdown() {
  const { users, currentUser, setCurrentUser } = useUser();
  return (
    <select
      className="select select-bordered"
      value={currentUser.address}
      onChange={e => setCurrentUser(users.find(u => u.address === e.target.value) || users[0])}
    >
      {users.map(user => (
        <option key={user.address} value={user.address}>{user.name} ({user.address.slice(0, 6)}...)</option>
      ))}
    </select>
  );
} 