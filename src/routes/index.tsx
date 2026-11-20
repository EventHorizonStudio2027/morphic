import { createFileRoute } from "@tanstack/react-router";
import { MorphicApp } from "@/components/morphic/MorphicApp";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <MorphicApp />;
}
