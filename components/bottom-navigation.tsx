"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Map, Heart, User, Smartphone } from "lucide-react";

interface BottomNavigationProps {
  activeTab?: string;
}

export function BottomNavigation({
  activeTab = "Home",
}: BottomNavigationProps) {
  const { user, logout, authenticated, ready } = usePrivy();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = mounted ? window.location.pathname : "";

  const navigationItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      name: "Explore",
      icon: Map,
      href: "/explore",
      active: pathname === "/explore",
    },
    {
      name: "Favorites",
      icon: Heart,
      href: "/favorites",
      active: pathname === "/favorites",
    },
    {
      name: "HHP",
      icon: Smartphone,
      href: "/hhp",
      active: pathname === "/hhp",
    },
    {
      name: "Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
