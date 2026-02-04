import React from 'react'
import Image from "next/image";

const FALLBACK_IMAGE = "/assets/FallBack.png";

export const FallBackComponent = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
         <Image
          src={FALLBACK_IMAGE}
          alt="Jamia Arabia Islamia Logo"
          width={150}
          height={150}
          priority
        />
    </div>
  )
}
