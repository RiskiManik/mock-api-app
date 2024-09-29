"use client";
import { getValidSubdomain } from "@/lib/subdomain";
import React, { useMemo } from "react";

const HomeApp = () => {
  const pathname = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.hostname;
    }
  }, []);
  return (
    <div>
      <h1>{getValidSubdomain(pathname!)}</h1>
    </div>
  );
};

export default HomeApp;
