"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="border-t border-white/10"
    >
      <div className="container mx-auto px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Image 
                                  src="/logo.png" 
                                  alt="BIH Real Estate Estimator Logo" 
                                  width={24} 
                                  height={24}
                                  className="w-8 h-8"
                                />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                BIH Real Estate Estimator
              </h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("description")}
            </p>
          </div>

          <div className="space-y-4 md:text-right">
             <motion.a
                href="https://github.com/TAR33k/bih-real-estate-estimator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github className="h-4 w-4" />
                <span>{t("viewSource")}</span>
                <ExternalLink className="h-3 w-3" />
              </motion.a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center md:text-right">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {t("copyright")}
          </p>
        </div>
      </div>
    </motion.footer>
  );
}