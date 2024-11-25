"use client"

import React, {  } from 'react'
import { useToast } from "@/hooks/use-toast"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'

export default function LibraryManagementSystem() {
  

  const { toast } = useToast()
  const url = `${PHX_HTTP_PROTOCOL}/${PHX_ENDPOINT}`



  return (
    <div className="container mx-auto p-4">
   
      <div>
        <h1 className="text-2xl font-bold mb-6">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        </div>
      </div>
    

    </div>
  )
}