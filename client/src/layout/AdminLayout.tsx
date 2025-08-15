import { useState, useEffect } from "react";
import ProfileCard from "@/components/layout/ProfileCard";
import api from "@/lib/axiosConfig";
import { Outlet } from "react-router-dom";
import type { User } from "@/types/user";

const AdminLayout = () => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: User = await api.get("/user/me");
        setUser(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error || !user) return <div>Error: {error}</div>;


  return (
    <div className="min-h-screen w-screen pt-16 px-28 flex flex-col gap-9">
      <div className="flex justify-end">
        <ProfileCard name={user.name} />
      </div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;