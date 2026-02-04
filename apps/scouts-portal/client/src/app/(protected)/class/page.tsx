"use client"
import CheckAuthentication from '@/components/CheckAuth/CheckAuth'
import ClassDropdown from '@/components/ClassDropdown/ClassDropdown'
import React from 'react'

 const page = () => {
  return <ClassDropdown/>
}

export default CheckAuthentication(page)