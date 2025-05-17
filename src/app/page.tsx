"use client";
import { Card } from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useState } from "react";
import { ELEMENTS } from "../lib/periodic-data";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FilterDrawer } from "@/components/filter-drawer";
import { Button } from "@/components/ui/button";
import { Filter, Undo2, X } from "lucide-react";

// Categories from the periodic table
const CATEGORIES = Array.from(
  new Set(ELEMENTS.map((el) => el.category))
).sort();

// Function to get Tailwind color classes based on element category
function getCategoryColorClass(category: string): string {
  switch (category) {
    case "Alkali Metal":
      return "bg-red-100 dark:bg-red-950 hover:bg-red-200 dark:hover:bg-red-900 dark:border-b-red-500 text-red-900 dark:text-red-100";
    case "Alkaline Earth Metal":
      return "bg-orange-100 dark:bg-orange-950 dark:border-b-orange-500 hover:bg-orange-200 dark:hover:bg-orange-900 text-orange-900 dark:text-orange-100";
    case "Transition Metal":
      return "bg-yellow-100 dark:bg-yellow-950 dark:border-b-yellow-500 hover:bg-yellow-200 dark:hover:bg-yellow-900 text-yellow-900 dark:text-yellow-100";
    case "Post-Transition Metal":
      return "bg-green-100 dark:bg-green-950 dark:border-b-green-500 hover:bg-green-200 dark:hover:bg-green-900 text-green-900 dark:text-green-100";
    case "Metalloid":
      return "bg-teal-100 dark:bg-teal-950 dark:border-b-teal-500 hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-900 dark:text-teal-100";
    case "Nonmetal":
      return "bg-blue-100 dark:bg-blue-950 dark:border-b-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-100";
    case "Halogen":
      return "bg-indigo-100 dark:bg-indigo-950 dark:border-b-indigo-500 hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-900 dark:text-indigo-100";
    case "Noble Gas":
      return "bg-purple-100 dark:bg-purple-950 dark:border-b-purple-500 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-100";
    case "Lanthanide":
      return "bg-pink-100 dark:bg-pink-950 dark:border-b-pink-500 hover:bg-pink-200 dark:hover:bg-pink-900 text-pink-900 dark:text-pink-100";
    case "Actinide":
      return "bg-rose-100 dark:bg-rose-950 dark:border-b-rose-500 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-100";
    default:
      return "bg-gray-100 dark:bg-gray-800 dark:border-b-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100";
  }
}

const GROUPS = [
  "All",
  ...Array.from(new Set(ELEMENTS.map((el) => el.group))).sort((a, b) => {
    // Convert to numbers for proper sorting, handling "Lanthanide" and "Actinide" specially
    const aNum = !isNaN(Number(a)) ? Number(a) : 999;
    const bNum = !isNaN(Number(b)) ? Number(b) : 999;
    return aNum - bNum;
  }),
];

const STATES = [
  "All",
  ...Array.from(new Set(ELEMENTS.map((el) => el.state))).sort(),
];

// Helper: Map element positions for the main table, lanthanides, and actinides
const PERIODS = 7;
const GROUPS_COUNT = 18;

// Build a 2D array for the main table (periods 1-7, groups 1-18)
const mainTable: ((typeof ELEMENTS)[0] | null)[][] = Array.from(
  { length: PERIODS },
  () => Array(GROUPS_COUNT).fill(null)
);
const lanthanides: ((typeof ELEMENTS)[0] | null)[] = Array(15).fill(null); // 57-71
const actinides: ((typeof ELEMENTS)[0] | null)[] = Array(15).fill(null); // 89-103

// Helper: Official group numbers for each element (1-18), including s, p, d, f blocks
// This mapping is based on IUPAC standard group assignments
const GROUP_MAP: Record<number, number> = {
  1: 1,
  2: 18,
  3: 1,
  4: 2,
  5: 13,
  6: 14,
  7: 15,
  8: 16,
  9: 17,
  10: 18,
  11: 1,
  12: 2,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18,
  19: 1,
  20: 2,
  21: 3,
  22: 4,
  23: 5,
  24: 6,
  25: 7,
  26: 8,
  27: 9,
  28: 10,
  29: 11,
  30: 12,
  31: 13,
  32: 14,
  33: 15,
  34: 16,
  35: 17,
  36: 18,
  37: 1,
  38: 2,
  39: 3,
  40: 4,
  41: 5,
  42: 6,
  43: 7,
  44: 8,
  45: 9,
  46: 10,
  47: 11,
  48: 12,
  49: 13,
  50: 14,
  51: 15,
  52: 16,
  53: 17,
  54: 18,
  55: 1,
  56: 2,
  57: 3,
  72: 4,
  73: 5,
  74: 6,
  75: 7,
  76: 8,
  77: 9,
  78: 10,
  79: 11,
  80: 12,
  81: 13,
  82: 14,
  83: 15,
  84: 16,
  85: 17,
  86: 18,
  87: 1,
  88: 2,
  89: 3,
  104: 4,
  105: 5,
  106: 6,
  107: 7,
  108: 8,
  109: 9,
  110: 10,
  111: 11,
  112: 12,
  113: 13,
  114: 14,
  115: 15,
  116: 16,
  117: 17,
  118: 18,
};

// Reset mainTable
mainTable.forEach((row, i) => mainTable[i].fill(null));
lanthanides.fill(null);
actinides.fill(null);

ELEMENTS.forEach((el) => {
  // Main table
  if (
    (el.number >= 1 && el.number <= 56) ||
    (el.number >= 72 && el.number <= 88) ||
    (el.number >= 104 && el.number <= 118)
  ) {
    // Use official group mapping if available
    const group = GROUP_MAP[el.number];
    if (group && el.period && el.period <= 7) {
      mainTable[el.period - 1][group - 1] = el;
    }
  }
  // Lanthanides
  if (el.number >= 57 && el.number <= 71) {
    lanthanides[el.number - 57] = el;
  }
  // Actinides
  if (el.number >= 89 && el.number <= 103) {
    actinides[el.number - 89] = el;
  }
});

export default function Home() {
  const [group, setGroup] = useState("All");
  const [state, setState] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = ELEMENTS.filter(
    (el) =>
      (group === "All" || el.group === group) &&
      (state === "All" || el.state === state) &&
      (category === "All" || el.category === category) &&
      (el.name.toLowerCase().includes(search.toLowerCase()) ||
        el.symbol.toLowerCase().includes(search.toLowerCase()))
  );

  // Highlight matching elements
  const isHighlighted = (el: (typeof ELEMENTS)[0]) => {
    return filtered.includes(el);
  };

  return (
    <div className="flex flex-col justify-start items-center bg-purple-100/40 dark:bg-background gap-8 py-10 pt-0 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row w-full justify-between items-center md:max-w-[90%]">
        <div className="flex items-center justify-center w-auto">
          <Image
            src="/Periodic logo.png"
            alt=""
            width={450}
            height={450}
            priority
            className="lg:h-12 h-20 w-auto"
          />
        </div>

        <Input
          placeholder="Search by name or symbol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hidden md:flex rounded-full w-full max-w-[500px]"
        />

        <div className="md:hidden flex items-center justify-center w-full space-x-2 mt-5">
          <Input
            placeholder="Search by name or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex rounded-full w-full"
          />
          <div className="flex justify-center items-center bottom-1 rounded-full space-x-2 border-foreground/20">
            {(category !== "All" ||
              group !== "All" ||
              state !== "All" ||
              search !== "") && (
              <Button
                size="icon"
                className="z-50 fixed bottom-5 right-5 border-0 px-5 opacity-100 bg-foreground w-auto rounded-full"
                onClick={() => {
                  setCategory("All");
                  setGroup("All");
                  setState("All");
                  setSearch("");
                }}
              >
                <p className="md:hidden text-background">Reset</p>
                <Undo2 className="text-background ml-2 h-4 w-4" />
              </Button>
            )}

            <FilterDrawer
              group={group}
              state={state}
              category={category}
              groups={GROUPS}
              states={STATES}
              categories={CATEGORIES}
              onGroupChange={setGroup}
              onStateChange={setState}
              onCategoryChange={setCategory}
              getCategoryColorClass={getCategoryColorClass}
            />
            <ThemeToggle />
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center bottom-1  rounded-full space-x-2 border-foreground/20">
          <Button
            size="icon"
            className="border-0 bg-foreground rounded-full md:px-14"
            onClick={() => {
              setCategory("All");
              setGroup("All");
              setState("All");
              setSearch("");
            }}
          >
            <p className="hidden md:block text-background">Reset</p>
            <Filter className="text-background h-4 w-4" />
          </Button>
          <FilterDrawer
            group={group}
            state={state}
            category={category}
            groups={GROUPS}
            states={STATES}
            categories={CATEGORIES}
            onGroupChange={setGroup}
            onStateChange={setState}
            onCategoryChange={setCategory}
            getCategoryColorClass={getCategoryColorClass}
          />
          <ThemeToggle />
        </div>
      </div>

      {/* Filters - Only visible on larger screens */}
      <div className="hidden lg:flex flex-col gap-6 w-full max-w-[90%]">
        {/* Category filters */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={category === "All" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCategory("All")}
            >
              All Categories
            </Badge>
            {CATEGORIES.map((c) => (
              <Badge
                key={c}
                variant={category === c ? "default" : "outline"}
                className={`cursor-pointer ${getCategoryColorClass(c)} ${
                  category === c
                    ? "border-2 border-primary dark:border-t-0 dark:border-l-0 dark:border-r-0"
                    : "border-0 !important"
                }`}
                onClick={() => setCategory(c)}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Periodic Table Container */}
      <div className="w-full flex flex-col items-center">
        <div
          className="overflow-x-auto pb-6 md:w-[90%] w-full"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="w-full">
            {/* Main periodic table grid */}
            <div className="relative w-full">
              {/* Group numbers */}
              <div className="grid grid-cols-18 gap-0 pl-6 mb-2 min-w-[1000px]">
                {Array.from({ length: 18 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center max-w-[50px] h-3 text-sm font-medium text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 min-w-[1000px]">
                {/* Period numbers */}
                <div className="flex flex-col justify-around py-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className="h-16 flex items-center justify-center text-sm font-medium text-muted-foreground w-2"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Elements grid */}
                <div className="grid grid-cols-18 lg:gap-3 gap-2  flex-1">
                  <TooltipProvider>
                    {mainTable.map((row, i) =>
                      row.map((el, j) => (
                        <div
                          key={`cell-${i}-${j}`}
                          className="relative aspect-square max-h-[50px] max-w-[50px] lg:max-h-[60px] lg:max-w-[60px]"
                        >
                          {el ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Card
                                  className={`
                                    flex flex-col items-center justify-center p-2 cursor-pointer
                                    transition-all duration-200 w-full h-full group
                                    rounded-sm border-b-2 shadow-none hover:scale-105
                                    ${getCategoryColorClass(el.category)}
                                    ${
                                      !isHighlighted(el) &&
                                      (group !== "All" ||
                                        state !== "All" ||
                                        category !== "All" ||
                                        search)
                                        ? "opacity-20 hover:opacity-100"
                                        : ""
                                    }
                                  `}
                                >
                                  <span className="lg:text-[0.5rem] text-[0.4rem] text-muted-foreground absolute top-0.5 left-0.5">
                                    {el.number}
                                  </span>
                                  <span className="text-lg font-bold group-hover:scale-110 transition-transform">
                                    {el.symbol}
                                  </span>
                                  <span className="text-[0.5rem] hidden md:block text-muted-foreground truncate w-full text-center absolute bottom-1 transition-all">
                                    {el.name}
                                  </span>
                                </Card>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                sideOffset={5}
                                className={`
                                    flex flex-col items-center justify-center p-2 cursor-pointer
                                    transition-all duration-200 w-full h-full group
                                    rounded-xl border border-b-2 hover:scale-105
                                    ${getCategoryColorClass(el.category)}
                                    ${
                                      !isHighlighted(el) &&
                                      (group !== "All" ||
                                        state !== "All" ||
                                        category !== "All" ||
                                        search)
                                        ? "hidden"
                                        : ""
                                    }
                                  `}
                              >
                                <div className="flex flex-col gap-1.5 p-1 min-w-[200px]">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg">
                                      {el.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      ({el.symbol})
                                    </span>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <span className="text-muted-foreground">
                                        Atomic Number:
                                      </span>{" "}
                                      {el.number}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        Atomic Mass:
                                      </span>{" "}
                                      {el.atomicMass}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        Group:
                                      </span>{" "}
                                      {el.group}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        Period:
                                      </span>{" "}
                                      {el.period}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        Category:
                                      </span>{" "}
                                      {el.category}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        State:
                                      </span>{" "}
                                      {el.state}
                                    </p>
                                    <p>
                                      <span className="text-muted-foreground">
                                        Electron Config:
                                      </span>{" "}
                                      {el.electronConfig}
                                    </p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1.5 border-t border-primary/20 pt-1.5">
                                    {el.summary}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="w-full h-full min-h-[4rem]" />
                          )}
                        </div>
                      ))
                    )}
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Lanthanides and Actinides */}
            <div className="lg:mt-5 grid lg:gap-3 gap-0 min-w-[1000px]">
              {/* Lanthanides */}
              <div className="flex gap-4 items-start pl-[15.1%]">
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground w-6 h-16">
                  <span className="text-xs">57-71</span>
                </div>
                <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-2 flex-1">
                  <TooltipProvider>
                    {lanthanides.map((el, i) => (
                      <div
                        key={`lanth-${i}`}
                        className="relative aspect-square max-h-[50px] lg:max-h-[60px] max-w-[50px] lg:max-w-[60px]"
                      >
                        {el && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card
                                className={`
                                  flex flex-col items-center justify-center p-2 cursor-pointer
                                  transition-all duration-200 w-full h-full group
                                  rounded-sm border-b-2 shadow-none hover:scale-105
                                  ${getCategoryColorClass(el.category)}
                                  ${
                                    !isHighlighted(el) &&
                                    (group !== "All" ||
                                      state !== "All" ||
                                      category !== "All" ||
                                      search)
                                      ? "opacity-20 hover:opacity-100"
                                      : ""
                                  }
                                `}
                              >
                                <span className="text-[0.5rem] text-muted-foreground absolute top-1 left-1">
                                  {el.number}
                                </span>
                                <span className="text-lg font-bold group-hover:scale-110 transition-transform">
                                  {el.symbol}
                                </span>
                                <span className="text-[0.5rem] hidden md:block text-muted-foreground truncate w-full text-center absolute bottom-1 transition-all">
                                  {el.name}
                                </span>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className={`
                                    flex flex-col items-center justify-center p-2 cursor-pointer
                                    transition-all duration-200 w-full h-full group
                                    rounded-xl border border-b-2 hover:scale-105
                                    ${getCategoryColorClass(el.category)}
                                    ${
                                      !isHighlighted(el) &&
                                      (group !== "All" ||
                                        state !== "All" ||
                                        category !== "All" ||
                                        search)
                                        ? "hidden"
                                        : ""
                                    }
                                  `}
                            >
                              <div className="flex flex-col gap-1.5 p-1 min-w-[200px]">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-lg">
                                    {el.name}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    ({el.symbol})
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="text-muted-foreground">
                                      Atomic Number:
                                    </span>{" "}
                                    {el.number}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Atomic Mass:
                                    </span>{" "}
                                    {el.atomicMass}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Group:
                                    </span>{" "}
                                    {el.group}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Period:
                                    </span>{" "}
                                    {el.period}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Category:
                                    </span>{" "}
                                    {el.category}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      State:
                                    </span>{" "}
                                    {el.state}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Electron Config:
                                    </span>{" "}
                                    {el.electronConfig}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5 border-t pt-1.5">
                                  {el.summary}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ))}
                  </TooltipProvider>
                </div>
              </div>

              {/* Actinides */}
              <div className="flex gap-4 items-start pl-[15.1%] ">
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground w-6 h-16">
                  <span className="text-xs">89-103</span>
                </div>
                <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-2 flex-1">
                  <TooltipProvider>
                    {actinides.map((el, i) => (
                      <div
                        key={`actin-${i}`}
                        className="relative aspect-square max-w-[50px] lg:max-w-[60px]"
                      >
                        {el && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card
                                className={`
                                  flex flex-col items-center justify-center p-2 cursor-pointer
                                  transition-all duration-200 w-full h-full group
                                  rounded-sm border-b-2 shadow-none hover:scale-105
                                  ${getCategoryColorClass(el.category)}
                                  ${
                                    !isHighlighted(el) &&
                                    (group !== "All" ||
                                      state !== "All" ||
                                      category !== "All" ||
                                      search)
                                      ? "opacity-20 hover:opacity-100"
                                      : ""
                                  }
                                `}
                              >
                                <span className="text-[0.5rem] text-muted-foreground absolute top-1 left-1">
                                  {el.number}
                                </span>
                                <span className="text-lg font-bold group-hover:scale-110 transition-transform">
                                  {el.symbol}
                                </span>
                                <span className="text-[0.5rem] hidden md:block text-muted-foreground truncate w-full text-center absolute bottom-1 transition-all">
                                  {el.name}
                                </span>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className={`
                                    flex flex-col items-center justify-center p-2 cursor-pointer
                                    transition-all duration-200 w-full h-full group
                                    rounded-xl border border-b-2 hover:scale-105
                                    ${getCategoryColorClass(el.category)}
                                    ${
                                      !isHighlighted(el) &&
                                      (group !== "All" ||
                                        state !== "All" ||
                                        category !== "All" ||
                                        search)
                                        ? "hidden"
                                        : ""
                                    }
                                  `}
                            >
                              <div className="flex flex-col gap-1.5 p-1 min-w-[200px]">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-lg">
                                    {el.name}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    ({el.symbol})
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="text-muted-foreground">
                                      Atomic Number:
                                    </span>{" "}
                                    {el.number}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Atomic Mass:
                                    </span>{" "}
                                    {el.atomicMass}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Group:
                                    </span>{" "}
                                    {el.group}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Period:
                                    </span>{" "}
                                    {el.period}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Category:
                                    </span>{" "}
                                    {el.category}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      State:
                                    </span>{" "}
                                    {el.state}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">
                                      Electron Config:
                                    </span>{" "}
                                    {el.electronConfig}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5 border-t pt-1.5">
                                  {el.summary}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
