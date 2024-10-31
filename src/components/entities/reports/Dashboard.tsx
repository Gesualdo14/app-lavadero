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
import { getWeekOfYear } from "@/helpers/date";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export const description = "A collection of health charts.";

function groupByWeek(array: any[]): {
  week: number;
  year: number;
  amount: number;
}[] {
  return Object.values(
    array.reduce((acumulador, objeto) => {
      // Obtiene la clave de semana actual
      const semana = objeto.week;

      // Si no existe aún esa semana en el acumulador, inicializa un objeto para esa semana
      if (!acumulador[semana]) {
        acumulador[semana] = {
          week: semana,
          year: objeto.year, // Asigna el año para referencia
          amount: 0,
        };
      }

      // Suma el amount actual al total de esa semana
      acumulador[semana].amount += objeto.amount;

      return acumulador;
    }, {})
  );
}

function obtenerPrimerDiaDeLaSemana(year: number, week: number) {
  const firstDayOfYear = new Date(year, 0, 1);
  const dayOffset =
    (week - 1) * 7 +
    (firstDayOfYear.getDay() <= 4
      ? -firstDayOfYear.getDay() + 1
      : 8 - firstDayOfYear.getDay());
  return new Date(year, 0, 1 + dayOffset).toUTCString();
}

export function Dashboard() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [weeklySales, setWeeklySales] = useState<any[]>([]);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const { data: sales, isPending } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const data = await actions.getReports({
        searchText: "",
      });
      console.log({ data });

      return data?.data?.data || [];
    },
  });

  useEffect(() => {
    if (Array.isArray(sales) && Array.isArray(weeklySales)) {
      setFilteredSales(sales.filter((s) => s.week === selectedWeek));
    }
  }, [selectedWeek, weeklySales]);

  useEffect(() => {
    console.log("sales", sales);
    if (Array.isArray(sales) && sales.length > 0) {
      const processedSales = groupByWeek(sales);
      setWeeklySales(processedSales);
      const lastWeek = processedSales?.sort(
        (a: any, b: any) => a.week - b.week
      )[processedSales.length - 1]?.week;
      console.log({ lastWeek, processedSales });
      setSelectedWeek(lastWeek as number);
    }
  }, [sales]);

  return (
    <div className="chart-wrapper flex max-w-6xl flex-col flex-wrap items-start gap-6 sm:flex-row p-4">
      <div className="grid w-full gap-6  grid-cols-1 ">
        <Card x-chunk="charts-01-chunk-0 ">
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Última semana</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {toMoney(
                Array.isArray(weeklySales)
                  ? weeklySales?.sort((a: any, b: any) => a.week - b.week)[
                      weeklySales.length - 1
                    ]?.amount || 0
                  : 0
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
                data={weeklySales
                  ?.sort((a: any, b: any) => a.week - b.week)
                  .map((r: any) => ({
                    date: obtenerPrimerDiaDeLaSemana(r.year, r.week),
                    ventas: r.amount,
                    week: r.week,
                  }))}
              >
                <Bar
                  dataKey="ventas"
                  fill={"var(--color-steps)"}
                  radius={5}
                  fillOpacity={0.6}
                  onClick={(data) => {
                    setSelectedWeek(data.week);
                  }}
                  shape={(props: any) => (
                    <Rectangle
                      {...props}
                      fill={
                        !!selectedWeek && selectedWeek === props.week
                          ? "#4589cc"
                          : "var(--color-steps)"
                      }
                    />
                  )}
                  activeBar={<Rectangle fillOpacity={0.8} fill="#4589cc" />}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tickFormatter={(value) => {
                    return `Sem ${getWeekOfYear(new Date(value))}`;
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
                    (weeklySales?.reduce(
                      (acc: number, curr: any) =>
                        acc + ((curr?.amount as number) || 0),
                      0
                    ) || 1) / (weeklySales?.length || 1)
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
                      (weeklySales?.reduce(
                        (acc: number, curr: any) =>
                          acc + ((curr?.amount as number) || 0),
                        0
                      ) || 1) / (weeklySales?.length || 1)
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
              En las últimas {sales?.length} semanas, hubieron ventas por un
              total de{" "}
              <span className="font-medium text-foreground">
                {toMoney(
                  sales?.reduce(
                    (acc, curr) => acc + ((curr?.amount as number) || 0),
                    0
                  ) || 1
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
        <CardTitle className="text-md font-medium mb-3">
          Ventas por día
        </CardTitle>
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center">Día</TableHead>
              <TableHead className="min-w-20 text-center">Lavados</TableHead>
              <TableHead className="min-w-20 text-center">Monto</TableHead>
              <TableHead className="min-w-20 text-center">Propina</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableSkeletonComponent />
            ) : (
              Array.isArray(filteredSales) &&
              filteredSales
                ?.sort((a, b) => Number(b.day) - Number(a?.day))
                .map((s, index) => (
                  <TableRow key={index} className="cursor-pointer text-center">
                    <TableCell className="font-medium w-20">
                      <span>{`${format(new Date(s.year, s.month - 1, s.day), "d MMM")}`}</span>
                    </TableCell>

                    <TableCell className="w-20">{s.count}</TableCell>
                    <TableCell className="w-20">
                      {toMoney(s.amount as number)}
                    </TableCell>
                    <TableCell className="w-20">
                      {s.gathered - s.amount > 0
                        ? toMoney(s.gathered - s.amount)
                        : null}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
