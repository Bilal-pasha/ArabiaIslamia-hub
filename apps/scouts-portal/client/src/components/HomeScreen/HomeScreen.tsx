"use client";
import React from "react";
import MadrasaTable from "../RegisteredMadrasasTable/RegisteredMadrasasTable";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import useSearchRole from "@/hooks/useSearchRole/useSearchRole";

const BANNER_IMAGES = [
  "/assets/banner/banner1.jpg",
  "/assets/banner/banner2.jpg",
  "/assets/banner/banner3.jpg",
  "/assets/banner/banner4.jpg",
  "/assets/banner/banner5.jpg",
  "/assets/banner/banner6.jpg",
  "/assets/banner/banner7.jpg",
];

import { Button } from "@/components/Button/Button";
import Link from "next/link";
import { protectedRoutes } from "@/utils/routes";
import { ROLE } from "@/constant/constant";

const HomeScreen: React.FC = () => {
  const userName = useSearchRole();
  return (
    <>
      <Carousel showArrows={true} infiniteLoop={true} autoPlay={true}>
        {BANNER_IMAGES.map((banner, index) => (
          <div key={index}>
            <Image
              src={banner}
              alt={`Banner ${index + 1}`}
              width={1200}
              height={400}
              className="w-full h-auto object-cover"
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
