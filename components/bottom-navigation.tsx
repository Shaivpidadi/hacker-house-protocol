"use client";

import {
  Home,
  Search,
  Heart,
  Calendar,
  User,
  LogOut,
  Wallet,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

interface BottomNavigationProps {
  activeTab?: string;
}

export function BottomNavigation({
  activeTab = "Home",
}: BottomNavigationProps) {
  const { user, logout, authenticated, ready } = usePrivy();
  const router = useRouter();
  const pathname = router.pathname || window.location.pathname;

  // Hide navigation on login page
  if (pathname === "/login") {
    return null;
  }

  // Hide navigation if not authenticated
  if (!authenticated || !ready) {
    return null;
  }

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    logout();
    router.push("/welcome");
  };

  const navItems = [
    { icon: Home, label: "Home", active: activeTab === "Home", href: "/" },
    {
      icon: Search,
      label: "Explore",
      active: activeTab === "Explore",
      href: "/explore",
    },
    {
      icon: Heart,
      label: "Favorites",
      active: activeTab === "Favorites",
      href: "/favorites",
    },
    {
      icon: Calendar,
      label: "Hackstay",
      active: activeTab === "Hackstay",
      href: "/hackstay",
    },
    {
      icon: Smartphone,
      label: "HHP",
      active: activeTab === "HHP",
      href: "/hhp",
    },
    {
      icon: User,
      label: "Profile",
      active: activeTab === "Profile",
      href: "/profile",
      onClick: handleProfileClick,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.onClick ? (
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300 hover:scale-110 hover:bg-muted/50"
                  onClick={item.onClick}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      item.active ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors ${
                      item.active
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Button>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300 hover:scale-110 hover:bg-muted/50"
                  >
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        item.active ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-xs transition-colors ${
                        item.active
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-12 right-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 glass"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        <div className="h-1 bg-foreground/20 mx-auto w-32 rounded-full mb-2"></div>
      </div>
    </div>
  );
}
