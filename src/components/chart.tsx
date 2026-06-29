import { useRef, useEffect } from 'react'
import { createChart, ColorType, AreaSeries, type IChartApi, type ISeriesApi } from 'lightweight-charts'

interface ChartData {
  time: string
  value: number
}

interface Props {
  data: ChartData[]
  height?: number
}

export function Chart({ data, height = 300 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi>(null)
  const seriesRef = useRef<ISeriesApi<'Area'>>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#171719' },
        textColor: '#9D9D9D',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: '#2E2E2E' },
        horzLines: { color: '#2E2E2E' },
      },
      timeScale: { borderColor: '#3D3D3D' },
      crosshair: { mode: 0 },
    })
    const series = chart.addSeries(AreaSeries, {
      lineColor: '#CEF739',
      topColor: 'rgba(206, 247, 57, 0.3)',
      bottomColor: 'rgba(206, 247, 57, 0)',
      priceLineVisible: false,
    })
    series.setData(data)
    chart.timeScale().fitContent()

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current!.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    chartRef.current = chart
    seriesRef.current = series

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [height])

  useEffect(() => {
    if (!seriesRef.current) return
    seriesRef.current.setData(data)
    chartRef.current?.timeScale().fitContent()
  }, [data])

  return <div ref={containerRef} className="w-full" />
}
