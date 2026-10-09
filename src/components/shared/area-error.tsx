"use client";

import { Button } from "@/components/ui/button";

export default function AreaError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h2 className="text-2xl font-semibold text-primary">This page could not load</h2>
      <p className="mt-2 text-muted-foreground">
        The server did not answer as expected. Check your connection and try once more.
      </p>
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}