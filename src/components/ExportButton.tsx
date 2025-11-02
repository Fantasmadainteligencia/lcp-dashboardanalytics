import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any[];
  columns: string[];
  filters: Record<string, string>;
}

export const ExportButton = ({ data, columns, filters }: ExportButtonProps) => {
  const handleExport = () => {
    try {
      // Usar orientação paisagem se houver muitas colunas
      const orientation = columns.length > 5 ? 'landscape' : 'portrait';
      const doc = new jsPDF({ orientation });
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(14, 14, 14);
      doc.text('Dashboard Analytics', pageWidth / 2, 20, { align: 'center' });
      
      // Data de exportação
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const exportDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Exportado em: ${exportDate}`, pageWidth / 2, 28, { align: 'center' });
      
      let currentY = 38;
      
      // Filtros aplicados
      const activeFilters = Object.entries(filters).filter(([_, value]) => value);
      if (activeFilters.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(14, 14, 14);
        doc.text('Filtros Aplicados:', 14, currentY);
        currentY += 7;
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        activeFilters.forEach(([column, value]) => {
          doc.text(`• ${column}: ${value}`, 20, currentY);
          currentY += 6;
        });
        currentY += 5;
      }
      
      // Estatísticas
      doc.setFontSize(12);
      doc.setTextColor(14, 14, 14);
      doc.text('Estatísticas:', 14, currentY);
      currentY += 7;
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Total de Registros: ${data.length}`, 20, currentY);
      currentY += 6;
      doc.text(`Colunas: ${columns.length}`, 20, currentY);
      currentY += 6;
      
      const numericColumns = columns.filter(col => 
        data.some(row => !isNaN(parseFloat(row[col])))
      );
      doc.text(`Colunas Numéricas: ${numericColumns.length}`, 20, currentY);
      currentY += 10;
      
      // Tabela de dados
      doc.setFontSize(12);
      doc.setTextColor(14, 14, 14);
      doc.text('Dados:', 14, currentY);
      currentY += 5;
      
      // Preparar dados para a tabela
      const tableData = data.map(row => columns.map(col => row[col] || ''));
      
      autoTable(doc, {
        head: [columns],
        body: tableData,
        startY: currentY,
        theme: 'grid',
        headStyles: {
          fillColor: [14, 14, 14],
          textColor: [241, 241, 241],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fillColor: [241, 241, 241],
          textColor: [14, 14, 14],
          fontSize: 7
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        margin: { left: 10, right: 10 },
        tableWidth: 'auto',
        styles: {
          cellPadding: 2,
          overflow: 'linebreak',
          cellWidth: 'wrap',
          minCellWidth: 15
        },
        columnStyles: columns.reduce((acc, _, index) => {
          acc[index] = { cellWidth: 'auto' };
          return acc;
        }, {} as any)
      });
      
      // Salvar PDF
      const fileName = `dashboard_export_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="gap-2 w-full"
      disabled={data.length === 0}
    >
      <FileDown className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
};
