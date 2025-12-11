/**
 * @file region-chart.tsx
 * @description 지역별 관광지 분포 차트 컴포넌트
 *
 * 이 컴포넌트는 17개 시/도별 관광지 개수를 수평 막대 차트로 시각화합니다.
 *
 * 주요 기능:
 * 1. 지역별 관광지 개수를 수평 막대 차트로 표시
 * 2. 호버 시 툴팁으로 상세 정보 표시
 * 3. 바 클릭 시 해당 지역 목록 페이지로 이동
 * 4. 반응형 디자인 (모바일/태블릿/데스크톱)
 *
 * @dependencies
 * - recharts: Bar, BarChart, XAxis, YAxis, CartesianGrid
 * - components/ui/card.tsx: Card 컴포넌트
 * - components/ui/chart.tsx: ChartContainer, ChartTooltip
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 * - next/navigation: useRouter
 * - lib/types/stats.ts: RegionStats 타입
 *
 * @see {@link docs/PRD.md} - 통계 대시보드 요구사항
 */

'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Map } from 'lucide-react';
import type { RegionStats } from '@/lib/types/stats';

interface RegionChartProps {
  data: RegionStats[];
}

/**
 * 지역별 관광지 분포 차트 컴포넌트
 * 수평 막대 차트로 17개 시/도별 관광지 개수를 표시합니다.
 */
export function RegionChart({ data }: RegionChartProps) {
  const router = useRouter();

  // 차트 설정
  const chartConfig = {
    count: {
      label: '관광지 수',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  // 바 클릭 핸들러 - 해당 지역 목록 페이지로 이동
  const handleBarClick = (chartData: { payload: RegionStats }) => {
    if (chartData?.payload?.areaCode) {
      router.push(`/?areaCode=${chartData.payload.areaCode}`);
    }
  };

  // 데이터가 없는 경우
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-500" aria-hidden="true" />
            <CardTitle>지역별 관광지 분포</CardTitle>
          </div>
          <CardDescription>지역별 통계 데이터가 없습니다.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-blue-500" aria-hidden="true" />
          <CardTitle>지역별 관광지 분포</CardTitle>
        </div>
        <CardDescription>
          17개 시/도의 관광지 현황을 확인하세요. 막대를 클릭하면 해당 지역의 관광지 목록으로 이동합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 10,
              right: 20,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="areaName"
              type="category"
              tickLine={false}
              axisLine={false}
              width={50}
              tick={{ fontSize: 12 }}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString('ko-KR')}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    if (payload && payload[0]?.payload) {
                      return payload[0].payload.areaName;
                    }
                    return '';
                  }}
                  formatter={(value) => {
                    return (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">관광지 수</span>
                        <span className="font-bold">
                          {Number(value).toLocaleString('ko-KR')}개
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
              onClick={handleBarClick}
              cursor="pointer"
              aria-label="지역별 관광지 수"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/**
 * 지역별 관광지 분포 차트 스켈레톤 컴포넌트
 * 로딩 상태를 표시합니다.
 */
export function RegionChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 막대 차트 스켈레톤 */}
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton
                className="h-6 rounded-r"
                style={{ width: `${Math.max(20, 100 - index * 8)}%` }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

