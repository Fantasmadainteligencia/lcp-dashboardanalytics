import { useState } from 'react';
import Papa from 'papaparse';
import { FileUpload } from '@/components/FileUpload';
import { StatsCards } from '@/components/StatsCards';
import { DataTable } from '@/components/DataTable';
import { ChartSection } from '@/components/ChartSection';
import { FilterPanel } from '@/components/FilterPanel';
import { ExportButton } from '@/components/ExportButton';
import { BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const cols = Object.keys(results.data[0]);
          setColumns(cols);
          setData(results.data);
          setFilteredData(results.data);
          toast.success(`${results.data.length} registros carregados com sucesso!`);
        }
      },
      error: (error) => {
        toast.error('Erro ao processar arquivo: ' + error.message);
      },
    });
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    setFilters(filters);
    
    if (Object.keys(filters).length === 0) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((row) => {
      return Object.entries(filters).every(([column, value]) => {
        if (!value) return true;
        const cellValue = String(row[column] ?? '').trim();
        return cellValue === value;
      });
    });

    setFilteredData(filtered);
    toast.success(`${filtered.length} registros encontrados`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="LCP Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Análise inteligente de dados CSV
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* File Upload */}
          <FileUpload onFileUpload={handleFileUpload} hasData={data.length > 0} />

          {data.length > 0 && (
            <>
              {/* Stats Cards */}
              <StatsCards data={filteredData} columns={columns} />

              {/* Filters */}
              <FilterPanel columns={columns} data={data} onFilterChange={handleFilterChange} />

              {/* Charts */}
              <ChartSection data={filteredData} columns={columns} />

              {/* Data Table */}
              <DataTable data={filteredData} columns={columns} />

              {/* Export Button */}
              <ExportButton data={filteredData} columns={columns} filters={filters} />
            </>
          )}

          {data.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                <BarChart3 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Comece fazendo upload de um arquivo CSV
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                O dashboard se adaptará automaticamente aos seus dados, gerando
                gráficos, estatísticas e filtros personalizados.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
