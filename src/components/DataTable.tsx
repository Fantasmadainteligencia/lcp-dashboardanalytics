import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableProps {
  data: any[];
  columns: string[];
}

export const DataTable = ({ data, columns }: DataTableProps) => {
  const displayData = data.slice(0, 100); // Limita a 100 linhas para performance

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dados da Tabela</h3>
        <ScrollArea className="h-[400px] rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((column, index) => (
                  <TableHead key={index} className="font-semibold">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/30">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {data.length > 100 && (
          <p className="text-sm text-muted-foreground mt-4">
            Mostrando 100 de {data.length.toLocaleString()} registros
          </p>
        )}
      </div>
    </Card>
  );
};
