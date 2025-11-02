import { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  hasData: boolean;
}

export const FileUpload = ({ onFileUpload, hasData }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'text/csv') {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  if (hasData) {
    return (
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Dados carregados com sucesso</p>
            <p className="text-xs text-muted-foreground">
              Faça upload de um novo arquivo CSV para substituir
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Novo Upload
            </div>
          </label>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="p-12 border-2 border-dashed border-primary/30 bg-gradient-to-br from-card to-muted/30 hover:border-primary/50 transition-colors cursor-pointer"
    >
      <label className="flex flex-col items-center gap-4 cursor-pointer">
        <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
          <Upload className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">
            Faça upload do seu arquivo CSV
          </h3>
          <p className="text-muted-foreground mb-4">
            Arraste e solte ou clique para selecionar
          </p>
          <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Selecionar Arquivo
          </div>
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
      </label>
    </Card>
  );
};
