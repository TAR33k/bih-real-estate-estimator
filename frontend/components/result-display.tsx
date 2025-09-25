"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Loader2, MapPin, TrendingUp, Home, Sparkles, Building, Bed, Bath } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FormSchemaType } from "./estimation-form";

interface ResultDisplayProps {
  price: number | null;
  isLoading: boolean;
  onReset: () => void;
  onNewEstimation: () => void;
  viewMode: 'sidebar' | 'fullscreen' | 'previous';
  formData?: FormSchemaType | null;
}

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const duration = 2000;

  useEffect(() => {
    if (value === null) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuint = 1 - Math.pow(1 - progress, 5);
      setCount(Math.floor(value * easeOutQuint));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

function PropertyDetails({ formData }: { formData: FormSchemaType }) {
  const t = useTranslations("Form");
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>{formData.location}</span></div>
      <div className="flex items-center gap-2"><Building className="h-4 w-4 text-primary" /><span>{formData.size_m2} m²</span></div>
      <div className="flex items-center gap-2"><Bed className="h-4 w-4 text-primary" /><span>{formData.rooms} {t("rooms")}</span></div>
      <div className="flex items-center gap-2"><Bath className="h-4 w-4 text-primary" /><span>{formData.bathrooms} {t("bathrooms")}</span></div>
    </div>
  );
}

export function ResultDisplay({ price, isLoading, onNewEstimation, viewMode, formData }: ResultDisplayProps) {
  const t = useTranslations("Result");

  if (viewMode === 'fullscreen') {
    return (
      <div className="w-full max-w-2xl">
        <div className="glass-panel p-8 md:p-12 text-center">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </motion.div>

          {formData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="bg-secondary/30 rounded-lg p-4 my-6">
              <PropertyDetails formData={formData} />
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" className="my-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                <p className="text-xl font-medium text-muted-foreground mt-4">{t("calculating")}</p>
              </motion.div>
            ) : price && (
              <motion.div key="result" className="my-8" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6, type: "spring" }}>
                <p className="text-lg font-medium text-muted-foreground">{t("estimatedPrice")}</p>
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent py-2">
                  <AnimatedCounter value={price} /><span className="text-4xl ml-2">{t("currency")}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {price && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
              <Button onClick={onNewEstimation} className="w-full h-12 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                <Home className="mr-2 h-4 w-4" />{t("newEstimation")}
              </Button>
              <p className="text-xs text-muted-foreground mt-6 text-center">{t("disclaimer")}</p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === 'previous' && price && formData) {
    return (
      <div className="w-full glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t("previousEstimation")}</h3>
          <Badge variant="secondary">{t("completed")}</Badge>
        </div>
        <PropertyDetails formData={formData} />
        <div className="text-center mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">{t("estimatedPrice")}</p>
          <div className="text-3xl font-bold text-primary">{price.toLocaleString()} {t("currency")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full glass-panel p-6 md:p-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      
      <div className="min-h-[250px] flex flex-col items-center justify-center bg-secondary/30 rounded-lg p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
              <p className="font-medium text-foreground mt-4">{t("loading")}</p>
              <p className="text-sm text-muted-foreground">{t("loadingMessage")}</p>
            </motion.div>
          ) : price && formData ? (
             <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
               <PropertyDetails formData={formData} />
               <div className="text-center mt-4 pt-4 border-t border-border/50">
                 <p className="text-sm text-muted-foreground">{t("estimatedPrice")}</p>
                 <div className="text-3xl font-bold text-primary"><AnimatedCounter value={price} /> {t("currency")}</div>
               </div>
             </motion.div>
          ) : (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <Calculator className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="font-medium text-foreground mt-4">{t("ready")}</p>
              <p className="text-sm text-muted-foreground">{t("readyMessage")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}