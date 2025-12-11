/**
 * @file type-chart.tsx
 * @description 타입별 관광지 분포 차트 컴포넌트
 *
 * 이 컴포넌트는 8개 관광 타입별 관광지 개수와 비율을 Donut Chart로 시각화합니다.
 *
 * 주요 기능:
 * 1. 타입별 관광지 개수를 Donut Chart로 표시
 * 2. 중앙에 전체 개수 표시
 * 3. 호버 시 툴팁으로 타입명, 개수, 비율 표시
 * 4. 섹션 클릭 시 해당 타입 목록 페이지로 이동
 * 5. 범례로 타입별 색상 표시
 * 6. 반응형 디자인 (모바일/태블릿/데스크톱)
 *
 * @dependencies
 * - recharts: Pie, PieChart, Cell, Label
 * - components/ui/card.tsx: Card 컴포넌트
 * - components/ui/chart.tsx: ChartContainer, ChartTooltip, ChartLegend
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 * - next/navigation: useRouter
 * - lib/types/stats.ts: TypeStats 타입
 *
 * @see {@link docs/PRD.md} - 통계 대시보드 요구사항
 */

'use client';

import * as React from 'react';
import { Pie, PieChart, Cell, Label } from 'recharts';
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
import { Tag } from 'lucide-react';
import type { TypeStats } from '@/lib/types/stats';

interface TypeChartProps {
  data: TypeStats[];
}

// 타입별 색상 설정 (8개 타입) - 서로 구분이 잘 되는 선명한 색상
const TYPE_COLORS: Record<string, string> = {
  '12': 'hsl(142 71% 45%)',   // 관광지 - 초록색 (Green)
  '14': 'hsl(221 83% 53%)',   // 문화시설 - 파란색 (Blue)
  '15': 'hsl(0 84% 60%)',     // 축제/행사 - 빨간색 (Red)
  '25': 'hsl(45 93% 47%)',    // 여행코스 - 노란색/금색 (Yellow/Gold)
  '28': 'hsl(262 83% 58%)',   // 레포츠 - 보라색 (Purple)
  '32': 'hsl(199 89% 48%)',   // 숙박 - 하늘색 (Sky Blue)
  '38': 'hsl(25 95% 53%)',    // 쇼핑 - 주황색 (Orange)
  '39': 'hsl(330 81% 60%)',   // 음식점 - 분홍색 (Pink)
};

const chartConfig: ChartConfig = {
  count: {
    label: '관광지 수',
  },
  '12': {
    label: '관광지',
    color: TYPE_COLORS['12'],
  },
  '14': {
    label: '문화시설',
    color: TYPE_COLORS['14'],
  },
  '15': {
    label: '축제/행사',
    color: TYPE_COLORS['15'],
  },
  '25': {
    label: '여행코스',
    color: TYPE_COLORS['25'],
  },
  '28': {
    label: '레포츠',
    color: TYPE_COLORS['28'],
  },
  '32': {
    label: '숙박',
    color: TYPE_COLORS['32'],
  },
  '38': {
    label: '쇼핑',
    color: TYPE_COLORS['38'],
  },
  '39': {
    label: '음식점',
    color: TYPE_COLORS['39'],
  },
};

/**
 * 타입별 관광지 분포 차트 컴포넌트
 * Donut Chart로 8개 관광 타입별 개수와 비율을 표시합니다.
 */
export function TypeChart({ data }: TypeChartProps) {
  const router = useRouter();

  // 전체 관광지 수 계산
  const totalCount = React.useMemo(() => {
    return data.reduce((sum, stat) => sum + stat.count, 0);
  }, [data]);

  // 차트 데이터에 fill 색상 추가
  const chartData = React.useMemo(() => {
    return data.map((stat) => ({
      ...stat,
      fill: chartConfig[stat.contentTypeId]?.color || 'hsl(var(--chart-1))',
    }));
  }, [data]);

  // 섹션 클릭 핸들러 - 해당 타입 목록 페이지로 이동
  const handleSectorClick = (chartData: { payload: TypeStats }) => {
    if (chartData?.payload?.contentTypeId) {
      router.push(`/?contentTypeId=${chartData.payload.contentTypeId}`);
    }
  };

  // 데이터가 없는 경우
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-purple-500" aria-hidden="true" />
            <CardTitle>타입별 관광지 분포</CardTitle>
          </div>
          <CardDescription>타입별 통계 데이터가 없습니다.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-purple-500" aria-hidden="true" />
          <CardTitle>타입별 관광지 분포</CardTitle>
        </div>
        <CardDescription>
          8개 관광 타입별 분포를 확인하세요. 섹션을 클릭하면 해당 타입의 관광지 목록으로 이동합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 차트와 상세 정보를 나란히 배치 */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* 도넛 차트 */}
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[300px]"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const payload = item.payload as TypeStats & { fill: string };
                      return (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: payload.fill }}
                            />
                            <span className="font-medium">{payload.typeName}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">관광지 수</span>
                            <span className="font-bold">
                              {Number(value).toLocaleString('ko-KR')}개
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">비율</span>
                            <span className="font-bold">{payload.percentage}%</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="typeName"
                innerRadius={55}
                outerRadius={90}
                strokeWidth={2}
                stroke="hsl(var(--background))"
                onClick={handleSectorClick}
                cursor="pointer"
                aria-label="타입별 관광지 분포"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.contentTypeId}
                    fill={entry.fill}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-xl sm:text-2xl font-bold"
                          >
                            {totalCount.toLocaleString('ko-KR')}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            전체 관광지
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          {/* 상세 정보 목록 (범례 + 수치) */}
          <div className="w-full lg:flex-1">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 lg:mb-4">
              타입별 상세 현황
            </h3>
            <ul className="space-y-2" role="list" aria-label="타입별 관광지 상세 목록">
              {chartData.map((stat) => (
                <li
                  key={stat.contentTypeId}
                  role="listitem"
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/?contentTypeId=${stat.contentTypeId}`)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/?contentTypeId=${stat.contentTypeId}`);
                    }
                  }}
                  aria-label={`${stat.typeName}: ${stat.count.toLocaleString('ko-KR')}개, ${stat.percentage}%`}
                >
                  {/* 색상 인디케이터 */}
                  <div
                    className="flex-shrink-0 h-4 w-4 rounded-sm"
                    style={{ backgroundColor: stat.fill }}
                    aria-hidden="true"
                  />

                  {/* 타입명 */}
                  <span className="flex-1 font-medium text-sm group-hover:text-primary transition-colors">
                    {stat.typeName}
                  </span>

                  {/* 개수 */}
                  <span className="text-sm font-semibold tabular-nums">
                    {stat.count.toLocaleString('ko-KR')}개
                  </span>

                  {/* 비율 바 + 퍼센트 */}
                  <div className="hidden sm:flex items-center gap-2 w-28">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.fill,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                      {stat.percentage}%
                    </span>
                  </div>

                  {/* 모바일에서는 비율만 표시 */}
                  <span className="sm:hidden text-xs text-muted-foreground tabular-nums">
                    ({stat.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 타입별 관광지 분포 차트 스켈레톤 컴포넌트
 * 로딩 상태를 표시합니다.
 */
export function TypeChartSkeleton() {
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
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
          {/* Donut 차트 스켈레톤 */}
          <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[220px] lg:h-[220px]">
            <Skeleton className="w-full h-full rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-[100px] w-[100px] sm:h-[110px] sm:w-[110px] rounded-full bg-background" />
            </div>
          </div>

          {/* 상세 정보 목록 스켈레톤 */}
          <div className="w-full lg:flex-1">
            <Skeleton className="h-4 w-32 mb-3 lg:mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 flex-1 max-w-[80px]" />
                  <Skeleton className="h-4 w-16" />
                  <div className="hidden sm:flex items-center gap-2 w-28">
                    <Skeleton className="h-2 flex-1 rounded-full" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

