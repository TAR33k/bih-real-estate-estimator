"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, Languages } from "lucide-react";
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

  useEffect(() => { setMounted(true); }, []);

  const currentLocale = pathname.split('/')[1] || 'en';
  const otherLocale = currentLocale === 'en' ? 'bs' : 'en';

  const switchLanguage = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
         <div className="flex h-16 items-center justify-between glass-panel px-6">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => window.location.reload()}
            >
              <motion.div 
                className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg shadow-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="BIH Real Estate Estimator Logo" 
                  width={24} 
                  height={24}
                  className="w-8 h-8"
                />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground">{headerT("title")}</h3>
                <p className="text-xs text-muted-foreground hidden sm:block">{headerT("tagline")}</p>
              </div>
            </motion.div>

            {mounted && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={switchLanguage} className="h-9 px-3">
                  <Languages className="h-4 w-4 mr-1.5" />
                  <span className="font-medium text-sm">{currentLocale.toUpperCase()}</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <motion.div
                        key={theme}
                        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-panel">
                    <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="mr-2 h-4 w-4" />{t("lightMode")}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="mr-2 h-4 w-4" />{t("darkMode")}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
         </div>
      </div>
    </motion.header>
  );
}