import {
  Bar,
  BarChart,
  Label,
  LabelList,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Users2, WashingMachine } from "lucide-react";

export const description = "A collection of health charts.";

export function Dashboard() {
  return (
    <div className="chart-wrapper flex max-w-6xl flex-col flex-wrap items-start gap-6 sm:flex-row p-4">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[28rem] lg:grid-cols-1">
        <Card className="lg:max-w-md" x-chunk="charts-01-chunk-0">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Hoy</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              $2.584{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                en ventas
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                steps: {
                  label: "Steps",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={[
                  {
                    date: "2024-01-01",
                    ventas: 1040,
                  },
                  {
                    date: "2024-01-02",
                    ventas: 3100,
                  },
                  {
                    date: "2024-01-03",
                    ventas: 2200,
                  },
                  {
                    date: "2024-01-04",
                    ventas: 2300,
                  },
                  {
                    date: "2024-01-05",
                    ventas: 1400,
                  },
                  {
                    date: "2024-01-06",
                    ventas: 3500,
                  },
                  {
                    date: "2024-01-07",
                    ventas: 2584,
                  },
                ]}
              >
                <Bar
                  dataKey="ventas"
                  fill="var(--color-steps)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-AR", {
                      weekday: "short",
                    });
                  }}
                />
                <ChartTooltip
                  defaultIndex={2}
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value: any) => {
                        return new Date(value).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={1200}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Promedio de ventas"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                  <Label
                    position="insideTopLeft"
                    value="2,303"
                    className="text-lg"
                    fill="hsl(var(--foreground))"
                    offset={10}
                    startOffset={100}
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            <CardDescription>
              En últimos 7 días, hubieron ventas por un total de{" "}
              <span className="font-medium text-foreground">$16.124</span>.
            </CardDescription>
            <CardDescription>
              Necesitás{" "}
              <span className="font-medium text-foreground">$3.876</span> para
              alcanzar tu objetivo.
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
      <div className="grid w-full gap-6 lg:max-w-[24rem]">
        <Card className="max-w-xl w-full" x-chunk="charts-01-chunk-4">
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                move: {
                  label: "Mercado Pago",
                  color: "hsl(var(--chart-1))",
                },
                stand: {
                  label: "Efectivo",
                  color: "hsl(var(--chart-2))",
                },
                exercise: {
                  label: "Tarjeta de crédito/débito",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[140px] w-full"
            >
              <BarChart
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 10,
                }}
                data={[
                  {
                    activity: "Mercado Pago",
                    value: (8 / 12) * 100,
                    label: "$180.104",
                    fill: "var(--color-stand)",
                  },
                  {
                    activity: "Efectivo",
                    value: (46 / 60) * 100,
                    label: "$210.030",
                    fill: "var(--color-exercise)",
                  },
                  {
                    activity: "Tarjetas",
                    value: (245 / 360) * 100,
                    label: "$181.087",
                    fill: "var(--color-move)",
                  },
                ]}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="activity"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-row border-t p-4">
            <div className="flex w-full items-center gap-2">
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">
                  Mercado pago
                </div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  110
                  <span className="text-sm font-normal text-muted-foreground">
                    pagos
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Efectivo</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  73
                  <span className="text-sm font-normal text-muted-foreground">
                    pagos
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="mx-2 h-10 w-px" />
              <div className="grid flex-1 auto-rows-min gap-0.5">
                <div className="text-xs text-muted-foreground">Tarjetas</div>
                <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                  79
                  <span className="text-sm font-normal text-muted-foreground">
                    pagos
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="grid w-full sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45.231,27</div>
            <p className="text-xs text-muted-foreground">
              +20.1% que el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lavados realizados
            </CardTitle>
            <WashingMachine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+600</div>
            <p className="text-xs text-muted-foreground">
              +19% que el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos clientes
            </CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+374</div>
            <p className="text-xs text-muted-foreground">
              +89 en la última semana
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
