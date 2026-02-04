"use client";
import React from "react";
import MadrasaTable from "../RegisteredMadrasasTable/RegisteredMadrasasTable";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import useSearchRole from "@/hooks/useSearchRole/useSearchRole";

// Import the banner images
import banner1 from "/public/assets/banner/banner1.jpg";
import banner2 from "/public/assets/banner/banner2.jpg";
import banner3 from "/public/assets/banner/banner3.jpg";
import banner4 from "/public/assets/banner/banner4.jpg";
import banner5 from "/public/assets/banner/banner5.jpg";
import banner6 from "/public/assets/banner/banner6.jpg";
import banner7 from "/public/assets/banner/banner7.jpg";

import { Button } from "@/components/Button/Button";
import Link from "next/link";
import { protectedRoutes } from "@/utils/routes";
import { ROLE } from "@/constant/constant";
// import banner6 from "/public/assets/banner/banner6.jpeg";

const HomeScreen: React.FC = () => {
  const userName = useSearchRole();
  return (
    <>
      <Carousel showArrows={true} infiniteLoop={true} autoPlay={true}>
        {[banner1, banner2, banner3, banner4, banner5, banner6, banner7].map((banner, index) => (
          <div key={index}>
            <Image
              src={banner}
              alt={`Banner ${index + 1}`}
              layout="responsive"
            />
          </div>
        ))}
      </Carousel>

      <div className="w-full p-6">
        <div className="flex justify-between py-4">
          <h1 className="text-2xl font-bold mb-4 text-green-800">
            Registered Schools
          </h1>
          {userName === ROLE.ADMIN && (
            <Button variant="primary" className="px-6">
              <Link href={protectedRoutes.FILTER}>Filter</Link>
            </Button>
          )}
        </div>
        <MadrasaTable />
      </div>
    </>
  );
};

export default HomeScreen;
