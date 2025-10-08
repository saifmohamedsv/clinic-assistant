"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import clsx from "clsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  namespace?: string;
  searchPlaceholderKey?: string;
  noResultsKey?: string;
  loading?: boolean;
}

export function DataTable<TData, TValue = string>({
  columns,
  data,
  namespace = "common",
  searchPlaceholderKey = "search",
  noResultsKey = "noResults",
  loading = true,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="p-4 overflow-hidden rounded-lg border border-border shadow-sm bg-card" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center ${isRTL ? "justify-start" : "justify-start"}`}>
        <div className={`mb-2 ${isRTL ? "ms-2" : "me-2"} w-full max-w-sm`}>
          <Input
            placeholder={t(searchPlaceholderKey)}
            value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              table.getColumn("phone")?.setFilterValue(event.target.value);
            }}
            className="w-full"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`whitespace-nowrap ${isRTL ? "text-right" : "text-left"}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={clsx(isRTL ? "text-right" : "text-left")}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center p-8 text-muted-foreground">
                  {t("loading")}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center p-8 text-muted-foreground">
                  {t(noResultsKey)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
