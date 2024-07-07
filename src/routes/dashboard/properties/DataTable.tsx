import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useDeletePost } from "@/lib/react-query/queriesAndMutations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    $id: false,
    // Add other columns as necessary
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [editAlertVisible, setEditAlertVisible] = React.useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const navigate = useNavigate(); 
  const deletePostMutation = useDeletePost();

  const handleEditSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 1) {
      const postId = selectedRows[0].original.$id;
      navigate(`/edit-post/${postId}`);
    } else {
      setEditAlertVisible(true);
    }
  };

  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const posts = selectedRows.map((row) => ({
        postId: row.original.$id,
        imageId: row.original.imageId, // Make sure imageId is included
      }));

      console.log(`Deleting posts:`, posts);

      posts.forEach(({ postId, imageId }) => {
        deletePostMutation.mutate({ postId, imageId }, {
          onSuccess: () => {
            // Handle successful deletion, e.g., refetching data or showing a notification
            console.log(`Post with id ${postId} deleted successfully.`);
          },
          onError: (error) => {
            // Handle error, e.g., showing a notification
            console.error(`Failed to delete post with id ${postId}:`, error);
          },
        });
      });
    } else {
      setDeleteAlertVisible(true)
    }
  }

  return (
    <div>
      <div className="flex gap-5 items-center justify-between py-4">
        <div className="group flex-1 rounded-md flex items-center w-full max-w-sm bg-slate-100 hover:bg-slate-200 focus-within:ring-2 ring-violet-800]">
          <img 
            src="/icons/search.svg" 
            alt="search titles"
            className="px-3"
          />
          <Input
            placeholder="Filter titles..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="w-full border-none bg-slate-100 group-hover:bg-slate-200 shad-input-2"
          />
        </div>

        <div className="w-full flex gap-3 flex-1 items-center justify-end">
          <div className="flex-center gap-2 px-2 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-md shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <img src="/icons/edit.svg" height={16} className="brightness-0" alt="edit" />
            <Button
              variant="none"
              className="border-none text-black p-0 bg-transparent cursor-pointer"
              onClick={handleEditSelected}
            >
              Edit
            </Button>
          </div>
          <div className="flex-center gap-2 px-2 cursor-pointer bg-slate-100 hover:bg-red-500 active:bg-red-600 rounded-md group shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <img src="/icons/delete.svg" height={18} className="group-hover:brightness-[100]" alt="delete" />
            <Button
              variant="none"
              className="border-none cursor-pointer bg-transparent p-0 text-red-500 group-hover:text-white transition-none"
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </div>
          <div className="flex-center gap-2 px-2 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-md shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <img src="/icons/filter.svg" alt="filters" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="none" className="outline-none border-none text-black p-0 bg-transparent cursor-pointer">
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Render Alert if visible */}
      {editAlertVisible && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Please select only one post to edit.
          </AlertDescription>
        </Alert>
      )}
      {deleteAlertVisible && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Please select at least one post to delete.          
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border border-black">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  <TableRow className="group hover:bg-slate-50" data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {index < table.getRowModel().rows.length - 1 && (
                    <TableRow className="border-none">
                      <TableCell colSpan={columns.length} className="p-0 sm:p-0">
                        <div><Separator /></div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-none cursor-pointer hover:bg-gray-200"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-none cursor-pointer hover:bg-gray-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
