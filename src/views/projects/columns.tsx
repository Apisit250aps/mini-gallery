'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { ProjectEntity } from '@/domains/schemas/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ColumnOptions {
  onEdit: (project: ProjectEntity) => void;
  onDelete: (project: ProjectEntity) => void;
}

export function getProjectColumns({ onEdit, onDelete }: ColumnOptions): ColumnDef<ProjectEntity>[] {
  return [
    // ── Select checkbox ──────────────────────────────────────────────────────
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
          aria-label="เลือกทั้งหมด"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
          aria-label="เลือกแถวนี้"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // ── Name ─────────────────────────────────────────────────────────────────
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-2"
        >
          ชื่อ Project
          <ArrowUpDown data-icon="inline-end" className="opacity-50" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name')}</span>
      ),
    },

    // ── Slug ─────────────────────────────────────────────────────────────────
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          {row.getValue('slug')}
        </code>
      ),
    },

    // ── Tags ─────────────────────────────────────────────────────────────────
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.getValue<string[]>('tags') ?? [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">—</span>
            )}
          </div>
        );
      },
    },

    // ── Status ───────────────────────────────────────────────────────────────
    {
      accessorKey: 'isActive',
      header: 'สถานะ',
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>('isActive');
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
          </Badge>
        );
      },
    },

    // ── Created At ───────────────────────────────────────────────────────────
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-2"
        >
          วันที่สร้าง
          <ArrowUpDown data-icon="inline-end" className="opacity-50" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue<Date | string>('createdAt');
        return (
          <span className="text-sm text-muted-foreground">
            {date ? format(new Date(date), 'dd MMM yyyy', { locale: th }) : '—'}
          </span>
        );
      },
    },

    // ── Actions ──────────────────────────────────────────────────────────────
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label="เมนูการจัดการ" />}>
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Pencil data-icon="inline-start" />
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 data-icon="inline-start" />
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
