"use client";
import CheckAuthentication from "@/components/CheckAuth/CheckAuth";
import { Filter } from "@/components/Filter/Filter";
import React from "react";

const page = () => {
  return <Filter />;
};

export default CheckAuthentication(page);
