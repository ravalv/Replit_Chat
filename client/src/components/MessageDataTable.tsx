import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface MessageDataTableProps {
  headers: string[];
  rows: (string | number)[][];
}

type SortDirection = "asc" | "desc" | null;

export function MessageDataTable({ headers, rows }: MessageDataTableProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
  };

  const sortedRows = [...rows];
  if (sortColumn !== null && sortDirection !== null) {
    sortedRows.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      const aNum = typeof aVal === "number" ? aVal : parseFloat(String(aVal).replace(/[^0-9.-]/g, ""));
      const bNum = typeof bVal === "number" ? bVal : parseFloat(String(bVal).replace(/[^0-9.-]/g, ""));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === "asc") {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return bStr < aStr ? -1 : bStr > aStr ? 1 : 0;
      }
    });
  }

  const getSortIcon = (columnIndex: number) => {
    if (sortColumn !== columnIndex) {
      return <ArrowUpDown className="w-3 h-3 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  return (
    <Card className="overflow-hidden my-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="font-mono text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(index)}
                    className="h-auto p-1 hover-elevate active-elevate-2"
                    data-testid={`button-sort-${index}`}
                  >
                    {header}
                    {getSortIcon(index)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} data-testid={`row-table-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    className="font-mono text-xs"
                    data-testid={`cell-${rowIndex}-${cellIndex}`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
