import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartSectionProps {
  data: any[];
  columns: string[];
}

const COLORS = [
  'hsl(220, 70%, 50%)',
  'hsl(190, 80%, 50%)',
  'hsl(260, 70%, 55%)',
  'hsl(340, 75%, 55%)',
  'hsl(30, 80%, 55%)',
];

export const ChartSection = ({ data, columns }: ChartSectionProps) => {
  // Identifica colunas numéricas
  const numericColumns = columns.filter(col => {
    return data.some(row => !isNaN(parseFloat(row[col])));
  });

  // Identifica colunas categóricas
  const categoricalColumns = columns.filter(col => !numericColumns.includes(col));

  // Prepara dados para gráfico de barras (primeiras 10 linhas)
  const barChartData = data.slice(0, 10).map((row, index) => {
    const item: any = { name: row[categoricalColumns[0]] || `Item ${index + 1}` };
    numericColumns.forEach(col => {
      item[col] = parseFloat(row[col]) || 0;
    });
    return item;
  });

  // Prepara dados para gráfico de pizza (agregação da primeira coluna categórica)
  const pieChartData = categoricalColumns.length > 0
    ? Object.entries(
        data.reduce((acc: any, row) => {
          const key = row[categoricalColumns[0]] || 'Outros';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      )
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }))
    : [];

  // Prepara dados para gráfico de linha (tendência ao longo do dataset)
  const lineChartData = data.slice(0, 20).map((row, index) => {
    const item: any = { index: index + 1 };
    numericColumns.slice(0, 2).forEach(col => {
      item[col] = parseFloat(row[col]) || 0;
    });
    return item;
  });

  return (
    <div className="space-y-6">
      {numericColumns.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Análise por Categorias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              {numericColumns.slice(0, 3).map((col, index) => (
                <Bar
                  key={col}
                  dataKey={col}
                  fill={COLORS[index % COLORS.length]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pieChartData.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Distribuição</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {numericColumns.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Tendências</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="index" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                {numericColumns.slice(0, 2).map((col, index) => (
                  <Line
                    key={col}
                    type="monotone"
                    dataKey={col}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[index % COLORS.length] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
};
