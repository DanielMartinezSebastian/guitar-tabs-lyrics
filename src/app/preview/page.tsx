import { Suspense } from "react";
import { PreviewForm } from "@/components/preview-form";

export default function PreviewFormPage() {
  return (
    <Suspense fallback={null}>
      <PreviewForm />
    </Suspense>
  );
}
