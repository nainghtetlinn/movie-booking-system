import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ArrowDownUp } from "lucide-react"

import { Column } from "@tanstack/react-table"

interface Props {
  title: string
  column: Column<any>
}

const TableSortingBtn = ({ title, column }: Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-4"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {title}
      {column.getIsSorted() ? (
        column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowDownUp className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

export default TableSortingBtn
