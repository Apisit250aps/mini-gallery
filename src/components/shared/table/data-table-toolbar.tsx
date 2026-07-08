'use client';

import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumn?: string;
  filterPlaceholder?: string;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder = 'ค้นหา...',
  actions,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Global filter input */}
      {filterColumn && (
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
          className="h-9 max-w-xs"
          id="data-table-search"
        />
      )}

      {/* Column visibility toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="ml-auto" />}>
          <Settings2 data-icon="inline-start" />
          คอลัมน์
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(value) => col.toggleVisibility(!!value)}
                className="capitalize"
              >
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Custom action buttons (e.g. Create button) */}
      {actions}
    </div>
  );
}
