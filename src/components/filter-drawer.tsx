import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useWindowSize } from "@/hooks/use-window-size";

interface FilterDrawerProps {
  group: string;
  state: string;
  category: string;
  groups: string[];
  states: string[];
  categories: string[];
  onGroupChange: (group: string) => void;
  onStateChange: (state: string) => void;
  onCategoryChange: (category: string) => void;
  getCategoryColorClass: (category: string) => string;
}

export function FilterDrawer({
  group,
  state,
  category,
  groups,
  states,
  categories,
  onGroupChange,
  onStateChange,
  onCategoryChange,
  getCategoryColorClass,
}: FilterDrawerProps) {
  const { width } = useWindowSize();
  const [side, setSide] = useState<"left" | "bottom">("left");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (width) {
      setSide(width <= 900 ? "bottom" : "left");
    }
  }, [width]);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="lg:hidden">
        <Filter className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="border-0 bg-foreground rounded-full md:px-14"
        >
          <p className="hidden md:block text-background">Filter</p>
          <Filter className="text-background h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-full border bg-purple-100 dark:bg-background min-h-[60vh] flex justify-start items-center lg:max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-xl text-left w-full">Filters</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6 w-[90%]">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Groups:</h3>
            <div className="flex flex-wrap gap-2">
              {groups.map((g) => (
                <Badge
                  key={g}
                  variant={group === g ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onGroupChange(g)}
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">States:</h3>
            <div className="flex flex-wrap gap-2">
              {states.map((s) => (
                <Badge
                  key={s}
                  variant={state === s ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onStateChange(s)}
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={category === "All" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onCategoryChange("All")}
              >
                All Categories
              </Badge>
              {categories
                .filter((c) => c !== "All")
                .map((c) => (
                  <Badge
                    key={c}
                    variant={category === c ? "default" : "outline"}
                    className={`cursor-pointer ${getCategoryColorClass(c)}`}
                    onClick={() => onCategoryChange(c)}
                  >
                    {c}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
