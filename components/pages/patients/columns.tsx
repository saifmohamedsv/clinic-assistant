"use client";

import { Visit } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  visits: Visit[];
}

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => {
  return [
    {
      accessorKey: "name",
      header: t("columns.name"),
    },
    {
      accessorKey: "phone",
      header: t("columns.phone"),
    },
    {
      accessorKey: "age",
      header: t("columns.age"),
    },
    {
      accessorKey: "visits",
      header: t("columns.visitCount"),
      accessorFn: (data: Patient) => data.visits.length,
    },
    {
      id: "actions",
      cell: (): React.ReactNode => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("actions.openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("actions.viewDetails")}</DropdownMenuItem>
              <DropdownMenuItem>{t("actions.edit")}</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">{t("actions.delete")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
