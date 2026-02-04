"use client"
import CheckAuthentication from '@/components/CheckAuth/CheckAuth'
import React from 'react'

 const page = () => {
  return (
    <>
    <div className='h-[75vh] flex justify-center items-center'>
        <h2>This Page is building ! Sorry </h2>
    </div>
    </>
  )
}
export default CheckAuthentication(page)