'use client'
import Sidebar from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { BookOpen, Building, Building2, ChartBar, CloudUpload, DollarSign, FileClock, FileScan, FolderOpen, Home, LibraryBig, LogOut, Mail, Settings, ShieldCheck, Smartphone, Store, Tag, UserIcon, UserPlus, Users } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'


export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {


  interface NavItem {
    name: string
    href: string
    icon: React.ElementType
    countKey?: string
  }

  interface NavGroup {
    name: string
    items: NavItem[]
  }
  const navGroups: NavGroup[] = [
    {
      name: "Dashboard",
      items: [
        { name: "Overview", href: "/dashboard", icon: Home },
      ]
    },
    {
      name: "Operations",
      items: [
        { name: "Devices", href: "/devices", icon: Smartphone },
        { name: "Outlets", href: "/outlets", icon: Store },
        { name: "Sales", href: "/sales", icon: DollarSign },
      ]
    },
    {
      name: "System",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Users", href: "/users", icon: Users },
        { name: "Roles", href: "/roles", icon: ShieldCheck },
        { name: "Organizations", href: "/organizations", icon: Building2 },
      ]
    }
  ]


  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar navGroups={navGroups} sidebarTitle='DJTech' sidebarSubtitle='IoT Control Panel' />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="max-w mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900"></h1>
              <Link href="/profile" passHref>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Button>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className='lg:bg-white p-0 lg:p-8 lg:shadow rounded'>


              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </ProtectedRoute>

  )
}