"use client";

import { useForm, SubmitHandler, Control, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  MapPin, 
  Home, 
  Calendar, 
  Wrench, 
  Zap,
  Check,
  ChevronsUpDown,
  Building,
  Armchair,
  Ruler,
  Bath,
  Bed
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import * as formOptions from "@/lib/formOptions";

const tempSchema = z.object({
  location: z.string(),
  size_m2: z.coerce.number(),
  rooms: z.coerce.number(),
  floor: z.coerce.number(),
  bathrooms: z.coerce.number(),
  year_built: z.string(),
  condition: z.string(),
  furnished: z.string(),
  heating_type: z.string(),
  has_balcony: z.boolean(),
  has_garage: z.boolean(),
  has_parking: z.boolean(),
  has_elevator: z.boolean(),
  is_registered: z.boolean(),
  has_armored_door: z.boolean(),
});

export type FormSchemaType = z.infer<typeof tempSchema>;

interface EstimationFormProps {
  onSubmit: (data: FormSchemaType) => void;
  isLoading: boolean;
  isResultShown: boolean;
}

export function EstimationForm({ onSubmit, isLoading, isResultShown }: EstimationFormProps) {
  const t = useTranslations("Form");
  const validationT = useTranslations("Form.validation");
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const formSchema = z.object({
    location: z.string().min(1, validationT("locationRequired")),
    size_m2: z.coerce.number().min(15, validationT("sizeMin")).max(1000, validationT("sizeMax")),
    rooms: z.coerce.number().min(1, validationT("roomsMin")).max(20, validationT("roomsMax")),
    floor: z.coerce.number().int().min(-4, validationT("floorMin")).max(100, validationT("floorMax")),
    bathrooms: z.coerce.number().int().min(1, validationT("bathroomsMin")).max(10, validationT("bathroomsMax")),
    year_built: z.string().min(1, validationT("yearRequired")),
    condition: z.string().min(1, validationT("conditionRequired")),
    furnished: z.string().min(1, validationT("furnishedRequired")),
    heating_type: z.string().min(1, validationT("heatingRequired")),
    has_balcony: z.boolean().default(false),
    has_garage: z.boolean().default(false),
    has_parking: z.boolean().default(false),
    has_elevator: z.boolean().default(false),
    is_registered: z.boolean().default(true),
    has_armored_door: z.boolean().default(false),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      year_built: "",
      condition: "",
      furnished: "",
      heating_type: "",
      size_m2: 0,
      rooms: 0,
      floor: 0,
      bathrooms: 0,
      has_balcony: false,
      is_registered: false,
      has_garage: false,
      has_parking: false,
      has_elevator: false,
      has_armored_door: false,
    } as FormSchemaType,
  });

  const filteredLocations = useMemo(() => {
    const allCities = Object.values(formOptions.locationsByRegion).flat();
    const filtered = allCities.filter(location =>
      !locationSearch || location.toLowerCase().includes(locationSearch.toLowerCase())
    );
    return filtered.sort((a, b) => a.localeCompare(b));
  }, [locationSearch]);

  const handleSubmit = (data: FieldValues) => {
    onSubmit(data as FormSchemaType);
  };

  const getTranslatedLabel = (option: any) => {
    return formOptions.getTranslatedLabel(option, currentLocale);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{t("title")}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Location Field with Search */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <FormField
                  control={form.control as Control<any>}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{t("location")}</span>
                      </FormLabel>
                      <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={locationOpen}
                              className="w-full justify-between h-11 text-left font-normal"
                            >
                              {field.value || t("locationPlaceholder")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput 
                              placeholder={t("locationPlaceholder")}
                              value={locationSearch}
                              onValueChange={setLocationSearch}
                            />
                            <CommandList className="max-h-64">
                              <CommandEmpty>No locations found.</CommandEmpty>
                              {filteredLocations.map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={(selectedValue) => {
                                    field.onChange(selectedValue);
                                    setLocationOpen(false);
                                    setLocationSearch("");
                                  }}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === city ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Basic Property Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <FormField
                  control={form.control as Control<any>}
                  name="size_m2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span>{t("size")}</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<any>}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Bed className="h-4 w-4 text-primary" />
                        <span>{t("rooms")}</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<any>}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-primary" />
                        <span>{t("floor")}</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<any>}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Bath className="h-4 w-4 text-primary" />
                        <span>{t("bathrooms")}</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Property Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <FormField
                  control={form.control as Control<any>}
                  name="year_built"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{t("yearBuilt")}</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t("selectOption")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions.yearBuiltOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {getTranslatedLabel(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<any>}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Wrench className="h-4 w-4 text-primary" />
                        <span>{t("condition")}</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t("selectOption")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions.conditionOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {getTranslatedLabel(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<any>}
                  name="furnished"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Armchair className="h-4 w-4 text-primary" />
                        <span>{t("furnished")}</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t("selectOption")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions.furnishedOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {getTranslatedLabel(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<any>}
                  name="heating_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{t("heating")}</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t("selectOption")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formOptions.heatingOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {getTranslatedLabel(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <Separator className="my-6" />

              {/* Additional Features */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-primary" />
                  <h3 className="text-md font-semibold">{t("extras")}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "has_balcony", label: t("balcony") },
                    { name: "has_garage", label: t("garage") },
                    { name: "has_parking", label: t("parking") },
                    { name: "has_elevator", label: t("elevator") },
                    { name: "is_registered", label: t("registered") },
                    { name: "has_armored_door", label: t("armoredDoor") },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    >
                      <FormField
                        control={form.control as Control<any>}
                        name={feature.name as keyof FormSchemaType}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-medium">
                                {feature.label}
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("submitting")}</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {t("submit")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}