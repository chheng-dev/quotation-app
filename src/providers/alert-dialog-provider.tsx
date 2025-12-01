"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import React, { useContext, useState } from "react";

type AlertDialogProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive" | "success" | "warning";
  icon?: React.ComponentType<{ className?: string }>;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
  loading?: boolean;
  hideCancel?: boolean;
};

type alertDialogContextType = {
  openDialog: (options: AlertDialogProps) => void;
};

const AlertDialogContext = React.createContext<
  alertDialogContextType | undefined
>(undefined);

export function useAlertDialog() {
  const ctx = useContext(AlertDialogContext);
  if (!ctx)
    throw new Error(
      "useAlertDialog must be used within an AlertDialogProvider",
    );
  return ctx;
}

export default function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState<AlertDialogProps>({});
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = (opts: AlertDialogProps) => {
    setOptions(opts);
    setOpen(true);
    setIsLoading(false);
  };

  const handleAction = async () => {
    if (options.loading) {
      setIsLoading(true);
    }

    try {
      await options.onAction?.();
      if (!options.loading) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Dialog action error:", error);
    } finally {
      if (options.loading) {
        setIsLoading(false);
        setOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setOpen(false);
    options.onCancel?.();
  };

  const getIconBackgroundClass = () => {
    switch (options.variant) {
      case "success":
        return "bg-green-100 border border-green-200";
      case "destructive":
        return "bg-red-50 border-0";
      case "warning":
        return "bg-yellow-100 border border-yellow-200";
      default:
        return "bg-blue-100 border border-blue-200";
    }
  };

  const getIconColorClass = () => {
    switch (options.variant) {
      case "success":
        return "text-green-600";
      case "destructive":
        return "text-[#E57373]";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  const getActionButtonClass = () => {
    const baseClass =
      "flex-1 transition-all duration-200 font-semibold rounded-lg h-10 sm:h-11 px-6 sm:px-7 md:px-8 text-sm sm:text-base";
    switch (options.variant) {
      case "destructive":
        return cn(
          baseClass,
          "bg-red-500 text-white hover:bg-[#E53935] active:bg-[#D32F2F] focus:ring-2 focus:ring-[#EF5350]/30 focus:ring-offset-2",
        );
      case "success":
        return cn(
          baseClass,
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        );
      case "warning":
        return cn(
          baseClass,
          "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
        );
      default:
        return cn(
          baseClass,
          "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 focus:ring-1 focus:ring-slate-500 focus:ring-offset-1",
        );
    }
  };

  const getSizeClass = () => {
    switch (options.size) {
      case "sm":
        return "max-w-[90vw] sm:max-w-sm";
      case "lg":
        return "max-w-[90vw] sm:max-w-lg";
      default:
        return "max-w-[90vw] sm:max-w-md";
    }
  };

  const getDialogStyling = () => {
    switch (options.variant) {
      case "destructive":
        return "border-0 shadow-2xl rounded-md sm:rounded-lg";
      case "success":
        return "border-0 shadow-xl rounded-md sm:rounded-lg";
      case "warning":
        return "border-0 shadow-xl rounded-md sm:rounded-lg";
      default:
        return "shadow-lg rounded-md sm:rounded-lg";
    }
  };
  return (
    <AlertDialogContext.Provider value={{ openDialog }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          className={cn(
            "animate-in fade-in-0 zoom-in-95 p-5 sm:p-6 md:p-8 bg-white dark:bg-muted",
            getSizeClass(),
            getDialogStyling(),
          )}
        >
          {/* Close button */}
          {options.showCloseButton !== false && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="absolute right-4 top-4 sm:right-5 sm:top-5 md:right-6 md:top-6 rounded-sm opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-30"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <AlertDialogHeader className="space-y-4 sm:space-y-5 pb-2">
            {options.icon && (
              <div
                className={cn(
                  "mx-auto flex items-center justify-center rounded-full transition-all duration-300",
                  "h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20",
                  getIconBackgroundClass(),
                )}
              >
                <options.icon
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10",
                    getIconColorClass(),
                  )}
                />
              </div>
            )}
            <div className="space-y-2 sm:space-y-3 text-center">
              <AlertDialogTitle
                className={cn(
                  "text-xl sm:text-xl font-bold leading-tight tracking-tight",
                )}
              >
                {options.title || "Are you sure?"}
              </AlertDialogTitle>
              {options.description && (
                <AlertDialogDescription
                  className={cn(
                    "text-sm sm:text-base leading-relaxed w-full px-1 sm:px-2",
                    options.variant === "destructive"
                      ? "text-muted-foreground dark:text-muted-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {options.description}
                </AlertDialogDescription>
              )}
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter
            className={cn(
              "border-t-0 flex gap-2.5 sm:gap-3 md:gap-4",
              options.hideCancel ? "justify-center" : "flex-row",
            )}
          >
            {!options.hideCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className={cn(
                  "flex-1 transition-all duration-200 rounded-lg h-10 sm:h-11 px-6 sm:px-7 md:px-8 border text-sm sm:text-base",
                  options.variant === "destructive"
                    ? "border-gray-300 text-muted-foreground dark:text-white hover:bg-gray-100 hover:border-gray-400 bg-gray-50"
                    : "hover:bg-muted",
                )}
              >
                {options.cancelLabel || "Cancel"}
              </Button>
            )}
            <Button
              onClick={handleAction}
              disabled={isLoading}
              className={cn(
                "flex-1 transition-all duration-200 rounded-lg h-10 sm:h-11 px-6 sm:px-7 md:px-8 text-sm sm:text-base",
                getActionButtonClass(),
              )}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Processing..." : options.actionLabel || "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}
