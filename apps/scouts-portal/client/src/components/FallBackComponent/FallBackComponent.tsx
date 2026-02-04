import React from 'react'
import Image from "next/image";
import fallbackImage from "/public/assets/FallBack.png"
export const FallBackComponent = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
         <Image
          src={fallbackImage}
          alt="Jamia Arabia Islamia Logo"
          width={150}
          height={150}
          priority
        />
    </div>
  )
}
