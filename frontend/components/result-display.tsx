"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Loader2, 
  MapPin, 
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Home,
  X,
  Building,
  Bed,
  Bath,
  Calendar,
  Wrench,
  Zap,
  Armchair
} from "lucide-react";
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

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    };
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * easeOutCubic));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <motion.span>
      {count.toLocaleString()}
    </motion.span>
  );
}

function PropertyDetails({ formData }: { formData: FormSchemaType }) {
  const t = useTranslations("Form");
  
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="flex items-center space-x-2">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">{formData.location}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Building className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">{formData.size_m2} m²</span>
      </div>
      <div className="flex items-center space-x-2">
        <Bed className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">{formData.rooms} {t("rooms")}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Bath className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">{formData.bathrooms} {t("bathrooms")}</span>
      </div>
    </div>
  );
}

export function ResultDisplay({ price, isLoading, onReset, onNewEstimation, viewMode, formData }: ResultDisplayProps) {
  const t = useTranslations("Result");

  if (viewMode === 'fullscreen') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-8 h-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <Card className="glass-card border-2 border-primary/20 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center justify-center space-x-3 mb-4"
                >
                  <div className="relative">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
                      <TrendingUp className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-3 w-3 text-accent-foreground" />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
                    <p className="text-muted-foreground">{t("subtitle")}</p>
                  </div>
                </motion.div>

                {/* Property Details */}
                {formData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-muted/30 rounded-lg p-4 mb-6"
                  >
                    <PropertyDetails formData={formData} />
                  </motion.div>
                )}

                {/* Animated Price Display */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-muted-foreground">
                      {t("estimatedPrice")}
                    </p>
                    <div className="relative">
                      {isLoading ? (
                        <motion.div
                          className="flex items-center justify-center space-x-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                          <span className="text-2xl font-medium text-muted-foreground">
                            {t("calculating")}
                          </span>
                        </motion.div>
                      ) : price ? (
                        <motion.div
                          className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                        >
                          <AnimatedCounter value={price} duration={2500} />
                          <span className="text-4xl md:text-5xl ml-2">{t("currency")}</span>
                        </motion.div>
                      ) : null}
                      
                      {/* Floating particles effect */}
                      {price && [...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-primary/30 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + (i % 2) * 20}%`,
                          }}
                          animate={{
                            y: [-10, -30, -10],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5 + 1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Market Analysis */}
                {price && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{t("marketAnalysis")}</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">Bosnia and Herzegovina</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Local market analysis
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: price ? 1.4 : 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  {price && (
                    <Button
                      onClick={onNewEstimation}
                      className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      {t("newEstimation")}
                    </Button>
                  )}
                </motion.div>

                {/* Disclaimer */}
                {price && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                    className="bg-muted/30 border border-border/30 rounded-lg p-4"
                  >
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                      {t("disclaimer")}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'previous' && price && formData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full glass-card border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-muted to-muted/50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t("previousEstimation")}</h3>
                  <p className="text-xs text-muted-foreground">{t("lastResult")}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {t("completed")}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Property Details */}
            <PropertyDetails formData={formData} />
            
            {/* Price Display */}
            <div className="text-center py-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
              <p className="text-sm text-muted-foreground mb-1">{t("estimatedPrice")}</p>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {price.toLocaleString()} {t("currency")}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full glass-card">
        <CardHeader className="pb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <div className="min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center space-y-4"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">{t("loading")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("loadingMessage")}
                    </p>
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : price ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center space-y-4 w-full"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("estimatedPrice")}
                    </p>
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      <AnimatedCounter value={price} duration={2000} />
                      <span className="text-2xl ml-1">{t("currency")}</span>
                    </div>
                  </div>
                  
                  {formData && (
                    <div className="bg-muted/30 rounded-lg p-3 mt-4">
                      <PropertyDetails formData={formData} />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4"
                >
                  <motion.div 
                    className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-full mx-auto"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Calculator className="h-8 w-8 text-muted-foreground" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">{t("ready")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("readyMessage")}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}