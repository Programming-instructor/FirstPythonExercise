import { useState, useEffect } from "react";
import ProfileCard from "@/components/layout/ProfileCard";
import { Outlet } from "react-router-dom";
import { useFetchUser } from "@/hooks/useFetchUser";

const AdminLayout = () => {
  const { data: user, error, isLoading } = useFetchUser();

  if (isLoading) return <div>Loading...</div>;
  if (error || !user) return <div>an Error occurred</div>;


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