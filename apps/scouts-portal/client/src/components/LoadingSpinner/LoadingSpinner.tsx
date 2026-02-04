"use client";

import { Spinner } from "@arabiaaislamia/ui";

export interface ILoadingSpinner {
  customClass?: string;
  spinnerSize: "sm" | "default" | "lg";
}

export const LoadingSpinner = ({ customClass, spinnerSize }: ILoadingSpinner) => {
  return (
    <Spinner
      size={spinnerSize}
      className={customClass ? `text-primary-600 ${customClass}` : "text-primary-600"}
      aria-label="loading"
    />
  );
};
