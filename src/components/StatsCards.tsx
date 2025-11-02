import { Card } from '@/components/ui/card';
import { TrendingUp, Database, Layers } from 'lucide-react';

interface StatsCardsProps {
  data: any[];
  columns: string[];
}

export const StatsCards = ({ data, columns }: StatsCardsProps) => {
  const totalRows = data.length;
  const totalColumns = columns.length;
  
  const numericColumns = columns.filter(col => {
    return data.some(row => !isNaN(parseFloat(row[col])));
  });

  const stats = [
    {
      title: 'Total de Registros',
      value: totalRows.toLocaleString(),
      icon: Database,
      gradient: 'from-primary to-primary/80'
    },
    {
      title: 'Colunas',
      value: totalColumns.toString(),
      icon: Layers,
      gradient: 'from-accent to-accent/80'
    },
    {
      title: 'Colunas Numéricas',
      value: numericColumns.length.toString(),
      icon: TrendingUp,
      gradient: 'from-primary/80 to-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-foreground to-foreground/80">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-foreground">
                <Icon className="h-6 w-6 text-background" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
