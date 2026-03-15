import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="pb-20 md:pb-0 md:ml-[256px]">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}
