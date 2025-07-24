import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calculator, Menu, LogOut, User, Home, Upload, TrendingUp, MessageCircle } from "lucide-react";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/tax-savings", label: "Tax Savings", icon: TrendingUp },
    { href: "/chat", label: "TaxBot", icon: MessageCircle },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Calculator className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-neutral-800">EZTaxMate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-neutral-600 hover:text-primary"
                    }`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-neutral-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-4 bg-neutral-100 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-neutral-500">{user?.email}</p>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <div 
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                              isActive(item.href)
                                ? "text-primary bg-primary/10"
                                : "text-neutral-600 hover:bg-neutral-100"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button className="w-full bg-primary hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
