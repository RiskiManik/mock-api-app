"use client";
import { getValidSubdomain } from "@/lib/subdomain";
import { api } from "@/trpc/react";
import React, { useMemo } from "react";

const HomeApp = () => {
  const { data: users, isLoading } = api.users.getAll.useQuery();
  const { data: user, isLoading: isLoadingUser } = api.users.getById.useQuery({
    id: "9cc4db2a-6844-4496-90b1-01efc219cd10",
  });

  const pathname = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.hostname;
    }
  }, []);

  if (isLoading || isLoadingUser) return <div>Loading...</div>;
  return (
    <div>
      <h1>{getValidSubdomain(pathname!)}</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.name}, {user.subdomain}
          </li>
        ))}
      </ul>

      <p>{user?.name}</p>
    </div>
  );
};

export default HomeApp;
