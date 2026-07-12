import type { Metadata } from "next";
import { TunerScreen } from "@/components/tuner-screen";

export const metadata: Metadata = {
  title: "Afinador",
};

export default function TunerPage() {
  return <TunerScreen />;
}
