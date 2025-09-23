"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Moon, 
  Sun, 
  Languages, 
  Home as HomeIcon,
  Sparkles
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const headerT = useTranslations("Header");

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocale = pathname.split('/')[1] || 'en';
  const otherLocale = currentLocale === 'en' ? 'bs' : 'en';

  const switchLanguage = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl animate-pulse" />
              <div className="w-40 h-6 bg-primary/20 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-8 bg-primary/20 rounded animate-pulse" />
              <div className="w-10 h-8 bg-primary/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3 min-w-0 flex-1 sm:flex-initial"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative flex-shrink-0">
              {/* Custom Logo Container*/}
              <motion.div 
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg overflow-hidden"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* TODO: Replace with custom logo */}
                {/* <Image 
                  src="/logo.svg" 
                  alt="BIH Real Estate Estimator Logo" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                /> */}
                <HomeIcon className="h-5 w-5 text-primary-foreground" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-2 w-2 text-accent-foreground" />
                </motion.div>
              </motion.div>
            </div>
            
            <div className="flex flex-col min-w-0">
              <motion.h1 
                className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {headerT("title")} {headerT("subtitle")}
              </motion.h1>
              <motion.p 
                className="text-xs text-muted-foreground font-medium hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {headerT("tagline")}
              </motion.p>
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <motion.div 
            className="flex items-center space-x-2 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Language Switcher */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={switchLanguage}
                className="relative overflow-hidden group h-9 px-3"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  layoutId="languageHover"
                />
                <Languages className="h-4 w-4 mr-1.5" />
                <span className="font-medium text-sm">{currentLocale.toUpperCase()}</span>
              </Button>
            </motion.div>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="relative overflow-hidden group h-9 w-9 p-0">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      layoutId="themeHover"
                    />
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </motion.div>
                    <span className="sr-only">{t("theme")}</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>{t("lightMode")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>{t("darkMode")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}