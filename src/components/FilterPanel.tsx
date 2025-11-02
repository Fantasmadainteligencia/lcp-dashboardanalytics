import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  columns: string[];
  data: any[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export const FilterPanel = ({ columns, data, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedColumn, setSelectedColumn] = useState<string>('');

  const optionsByColumn = useMemo(() => {
    const map: Record<string, string[]> = {};
    columns.forEach((col) => {
      const values = Array.from(
        new Set(
          data
            .map((row) => String(row?.[col] ?? '').trim())
            .filter((v) => v.length > 0)
        )
      ).sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }));
      map[col] = values;
    });
    return map;
  }, [columns, data]);

  const handleFilterChange = (column: string, value: string) => {
    const newFilters = { ...filters, [column]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterRemove = (column: string) => {
    const newFilters = { ...filters };
    delete newFilters[column];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>
        {Object.keys(filters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar tudo
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione uma coluna" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {Object.entries(filters).map(([column, value]) => (
          <div key={column} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-sm mb-2 block">{column}</Label>
              <Select
                value={value}
                onValueChange={(val) => handleFilterChange(column, val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={`Selecione um valor para ${column}`} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {optionsByColumn[column]?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFilterRemove(column)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {selectedColumn && !filters[selectedColumn] && (
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-sm mb-2 block">{selectedColumn}</Label>
              <Select onValueChange={(val) => handleFilterChange(selectedColumn, val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={`Selecione um valor`} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {optionsByColumn[selectedColumn]?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {Object.keys(filters).length === 0 && !selectedColumn && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Selecione uma coluna para adicionar filtros
          </p>
        )}
      </div>
    </Card>
  );
};
