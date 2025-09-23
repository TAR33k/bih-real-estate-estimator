"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  Heart, 
  MapPin, 
  Brain,
  Github,
  Database,
  ExternalLink,
  Home as HomeIcon,
  Sparkles
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Brand & Description Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                {/* Logo Container */}
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg overflow-hidden">
                  {/* TODO: Replace with custom logo */}
                  {/* <Image 
                    src="/logo.svg" 
                    alt="BIH Real Estate Estimator Logo" 
                    width={24} 
                    height={24}
                    className="w-6 h-6"
                  /> */}
                  <HomeIcon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BIH Real Estate Estimator
                </h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Brain className="h-3 w-3 text-primary" />
                  <span>{t("poweredBy")}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {t("description")}
            </p>
          </motion.div>

          {/* GitHub & Data Source Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4 md:text-right"
          >
            <div className="space-y-3">
              <motion.a
                href="https://github.com/TAR33k/bih-real-estate-estimator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="font-medium">{t("viewSource")}</span>
                <ExternalLink className="h-3 w-3 group-hover:text-primary transition-colors" />
              </motion.a>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground md:justify-end">
                <Database className="h-3 w-3 text-primary" />
                <span>{t("dataSource")}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground md:justify-end">
              <MapPin className="h-3 w-3 text-primary" />
              <span>Bosnia and Herzegovina</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-border/40"
        >
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span> {currentYear} {t("copyright")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
