"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useClinicSettingsStore } from "@/stores/clinicSettings";
import { useEffect, useState } from "react";
import LanguageSelect from "./language-select";
import { CheckCircle } from "lucide-react";

const clinicSettingsSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  visitPrice: z.number().min(0, "Visit price must be a positive number"),
  discountAmount: z.number().min(0, "Discount amount must be a positive number"),
  workingHours: z.object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  }),
});

type ClinicSettingsFormValues = z.infer<typeof clinicSettingsSchema>;

export function ClinicSettingsForm() {
  const t = useTranslations("settings");
  const { settings, updateSettings } = useClinicSettingsStore();
  const locale = useLocale();
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ClinicSettingsFormValues>({
    resolver: zodResolver(clinicSettingsSchema),
    defaultValues: {
      clinicName: settings.clinicName,
      visitPrice: settings.visitPrice,
      discountAmount: settings.discountAmount,
      workingHours: {
        startTime: settings.workingHours.startTime,
        endTime: settings.workingHours.endTime,
      },
    },
  });

  // Update form when store changes
  useEffect(() => {
    form.reset({
      clinicName: settings.clinicName,
      visitPrice: settings.visitPrice,
      discountAmount: settings.discountAmount,
      workingHours: {
        startTime: settings.workingHours.startTime,
        endTime: settings.workingHours.endTime,
      },
    });
  }, [settings, form]);

  const onSubmit = (values: ClinicSettingsFormValues) => {
    updateSettings(values);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-medium">{t("successMessage")}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Clinic Name */}
          <FormField
            control={form.control}
            name="clinicName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("clinicName")}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter clinic name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Visit Price and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="visitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("visitPrice")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("discountAmount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <Label className="text-base font-medium">{t("workingHours")}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workingHours.startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("startTime")}</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingHours.endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("endTime")}</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="w-full bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <LanguageSelect locale={locale} />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              {t("saveSettings")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
