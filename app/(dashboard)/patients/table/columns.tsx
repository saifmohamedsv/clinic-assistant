"use client";

import { Visit } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
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
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";

// This type is used to define the shape of our data.
interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  visits: Visit[];
}

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction): ColumnDef<Patient>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader 
          column={column} 
          title={t("columns.name")} 
        />
      ),
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
      accessorFn: (data) => data.visits.length,
    },
    {
      id: "actions",
      cell: () => {
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
              <DropdownMenuItem className="text-destructive">
                {t("actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
