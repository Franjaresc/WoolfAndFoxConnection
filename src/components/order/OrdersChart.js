"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

export function OrdersChart({ data }) {
    // Verificar si data está definido y no vacío
    if (!data || data.length === 0) return null;

    // Crear configuración dinámica para chartConfig en base a las claves en data
    const chartConfig = Object.keys(data[0]).reduce((config, key, index) => {
        if (key !== 'Date') { // Ignorar la clave 'Date'
            config[key] = {
                label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalizar el tipo
                color: `hsl(var(--chart-${index + 1}))`, // Color basado en el índice
            };
        }
        return config;
    }, {});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ordenes por mes</CardTitle>
                <CardDescription>La cantidad de ordenes realizadas y su tipo</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="Date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 7)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {/* Generar barras dinámicamente */}
                        {Object.keys(chartConfig).map((key) => (
                            <Bar key={key} dataKey={key} fill={chartConfig[key].color} radius={4} aria-label={`Bar for ${key}`} />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    );
}

export default React.memo(OrdersChart);
