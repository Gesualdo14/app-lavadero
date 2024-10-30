import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
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
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { toMoney } from "@/helpers/fmt";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { TableSkeletonComponent } from "@/components/custom-ui/Skeletons";

export const description = "A collection of health charts.";

const FILL_COLORS = {
  "ATH Móvil": "var(--color-stand)",
  Transferencia: "#aaa",
  Efectivo: "var(--color-exercise)",
  "Tarjeta de crédito": "var(--color-move)",
};

export function Dashboard() {
  const { data, isPending } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const data = await actions.getReports({
        searchText: "",
      });
      return data?.data?.data || [];
    },
  });

  if (isPending || !Array.isArray(data)) return "Loading sales...";

  const [sales, cashflows] = data;
  console.log({ cashflows });

  return (
    <div className="chart-wrapper flex max-w-6xl flex-col flex-wrap items-start gap-6 sm:flex-row p-4">
      <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-1 ">
        <Card x-chunk="charts-01-chunk-0 ">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Hoy</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {toMoney(
                Array.isArray(sales) ? sales[sales.length - 1].amount || 0 : 0
              )}{" "}
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
              className="max-h-48 w-full"
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={sales
                  ?.sort((a, b) => a.date - b.date)
                  .map((r) => ({
                    date: `${r.year}/${r.month}/${r.day}`,
                    ventas: r.amount,
                  }))}
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
                  y={
                    (sales?.reduce(
                      (acc, curr) => acc + (curr?.amount || 0),
                      0
                    ) || 1) / (sales?.length || 1)
                  }
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
                    value={toMoney(
                      (sales?.reduce(
                        (acc, curr) => acc + (curr?.amount || 0),
                        0
                      ) || 1) / (sales?.length || 1)
                    )}
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
              En las últimas {sales.length} semanas, hubieron ventas por un
              total de{" "}
              <span className="font-medium text-foreground">
                {toMoney(
                  sales?.reduce((acc, curr) => acc + (curr?.amount || 0), 0) ||
                    1
                )}
              </span>
              .
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
      {/* <div className="grid w-full gap-6 lg:max-w-[24rem]">
        <Card className="max-w-xl w-full" x-chunk="charts-01-chunk-4">
          <CardContent className="flex gap-6 p-4 pb-2">
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
              className="h-[150px] w-full gap-2"
            >
              <BarChart
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 30,
                }}
                data={cashflows.map((c) => ({
                  activity: c.method,
                  value: c.amount,
                  label: toMoney(c.amount),
                  fill: FILL_COLORS[c.method as keyof typeof FILL_COLORS],
                }))}
                layout="vertical"
                barSize={32}
                barGap={6}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="activity"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  width={100}
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
        </Card>
      </div> */}
      <Card className="px-5 py-3 w-full">
        <CardTitle className="text-sm font-medium mb-3">
          Evolución ventas diarias
        </CardTitle>
        <Table className="">
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>Día</TableHead>
              <TableHead className="min-w-24">Lavados</TableHead>
              <TableHead className="min-w-24">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableSkeletonComponent />
            ) : (
              Array.isArray(sales) &&
              sales
                ?.sort((a, b) => b.date - a.date)
                .map((s) => (
                  <TableRow key={s.id} className="cursor-pointer">
                    <TableCell className="font-medium w-80">
                      <span>{`${s.day}/${s.month}/${s.year}`}</span>
                    </TableCell>

                    <TableCell className="w-48">{s.quantity}</TableCell>
                    <TableCell className="w-48">{toMoney(s.amount)}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
