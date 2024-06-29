import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type PropertyData = {
    id: string
    title: string
    // status: "pending" | "processing" | "success" | "failed"
    // file: File[]
    price: number
    imageUrl: string
}


export const columns: ColumnDef<PropertyData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center h-[100%] w-[100%]">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              />
          </div>
        ),
      },
      {
        accessorKey: "imageUrl",
        header: ({ column }) => {
          return (
            <div className="flex h-[100%] justify-start items-center">
                <span>Image</span>
            </div>
        )
      },
      cell: ({ row }) => {
        const PropertyData = row.original
   
        return (<div>
          <img src={PropertyData.imageUrl} height={50} width={50} className="rounded-md bg-cover my-[-4px]" alt="image" />
        </div>)
      }
    },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <div className="flex h-[100%] justify-between items-center">
                <span>Title</span>
                <Button
                    className="p-[8px] border-none bg-gray-50 hover:bg-gray-200 cursor-pointer"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            </div>
        )
      },
    },
    {
      accessorKey: "$id",
      header: ({ column }) => {
        return (
            <div className="flex h-[100%] justify-between items-center">
                <span>Post ID</span>
            </div>
        )
      },
    },
    {
    accessorKey: "price",
    header: () => <div className="flex justify-start items-center text-left h-[100%] w-[100%]">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-left font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="flex justify-start items-center text-left h-[100%] w-[100%]">Status</div>,
  },
  {
    id: "actions",
    header: () => <div className="flex-center text-left h-[100%] w-[100%]">Actions</div>,
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <div className="flex-center">
            <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="ghost" className="h-8 w-8 p-0 border-none bg-slate-100 hover:bg-slate-200 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                Edit post
                </DropdownMenuItem>
                <DropdownMenuItem>View tour booking</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="focus:bg-red focus:text-white">Delete post</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
