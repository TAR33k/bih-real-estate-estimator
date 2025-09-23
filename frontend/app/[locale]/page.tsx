"use client";

import { useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EstimationForm, FormSchemaType } from "@/components/estimation-form";
import { ResultDisplay } from "@/components/result-display";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = 'form' | 'full-result' | 'split-view';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [previousPrediction, setPreviousPrediction] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormSchemaType | null>(null);
  const [previousFormData, setPreviousFormData] = useState<FormSchemaType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const t = useTranslations("Result");

  const handleFormSubmit = async (data: FormSchemaType) => {
    setIsLoading(true);
    setPrediction(null);
    setFormData(data);
    setViewMode('full-result');
    
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/predict",
        data
      );
      setPrediction(response.data.estimated_price_km);
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t('errorMessage'), {
        description: t('errorTitle'),
      });
      setViewMode('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEstimation = () => {
    setPreviousPrediction(prediction);
    setPreviousFormData(formData);
    
    setPrediction(null);
    setFormData(null);
    
    setViewMode('split-view');
  };

  const handleReset = () => {
    setPrediction(null);
    setPreviousPrediction(null);
    setFormData(null);
    setPreviousFormData(null);
    setViewMode('form');
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Header />
      
      <motion.main 
        className="flex-grow container mx-auto p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {/* Initial form view */}
          {viewMode === 'form' && (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
            >
              {/* Form Section */}
              <motion.div 
                className="lg:sticky lg:top-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <EstimationForm
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  isResultShown={false}
                />
              </motion.div>

              {/* Results Section */}
              <motion.div 
                className="lg:sticky lg:top-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <ResultDisplay
                  price={null}
                  isLoading={false}
                  onReset={handleReset}
                  onNewEstimation={handleNewEstimation}
                  viewMode="sidebar"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Full-screen result view */}
          {viewMode === 'full-result' && (
            <motion.div
              key="full-result-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full"
            >
              <ResultDisplay
                price={prediction}
                isLoading={isLoading}
                onReset={handleReset}
                onNewEstimation={handleNewEstimation}
                viewMode="fullscreen"
                formData={formData}
              />
            </motion.div>
          )}

          {/* Split view with previous results */}
          {viewMode === 'split-view' && (
            <motion.div
              key="split-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
            >
              {/* Form Section */}
              <motion.div 
                className="lg:sticky lg:top-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <EstimationForm
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  isResultShown={true}
                />
              </motion.div>

              {/* Results Section with Previous Results */}
              <motion.div 
                className="lg:sticky lg:top-8 space-y-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Current/Loading Results */}
                <ResultDisplay
                  price={prediction}
                  isLoading={isLoading}
                  onReset={handleReset}
                  onNewEstimation={handleNewEstimation}
                  viewMode="sidebar"
                />
                
                {/* Previous Results */}
                {previousPrediction && previousFormData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <ResultDisplay
                      price={previousPrediction}
                      isLoading={false}
                      onReset={handleReset}
                      onNewEstimation={handleNewEstimation}
                      viewMode="previous"
                      formData={previousFormData}
                    />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <Footer />
      <SonnerToaster />
    </div>
  );
}