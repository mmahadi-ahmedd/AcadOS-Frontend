"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUrlParams } from "@/hooks/use-url-params";

export function SearchBox({ placeholder }: { placeholder: string }) {
  const url = useUrlParams();
  const [text, setText] = useState(url.get("q"));

  // Wait for a pause in typing before touching the URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== url.get("q")) url.set({ q: text || undefined });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
      />
    </div>
  );
}