"use client";
import CheckAuthentication from "@/components/CheckAuth/CheckAuth";
import HomeScreen from "@/components/HomeScreen/HomeScreen";
import React from "react";

const Page: React.FC = () => {
  return (
    <main className="flex flex-col animate justify-center items-center">
      <HomeScreen />
    </main>
  );
};

export default CheckAuthentication(Page);
