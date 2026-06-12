"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon, HouseIcon, StarIcon, CalendarIcon } from "@phosphor-icons/react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: HouseIcon },
    { href: "/top", label: "Top Anime", icon: StarIcon },
    { href: "/upcoming", label: "Upcoming", icon: CalendarIcon },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 pr-4 pl-4">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-red-600">
            AnimIndo
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive
                      ? "text-red-600 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:text-red-600"
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Button */}
          <Link
            href="/search"
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <MagnifyingGlassIcon size={20} />
            <span>Cari Anime</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}