/**
 * @file stats-summary.tsx
 * @description 통계 요약 카드 컴포넌트
 *
 * 이 컴포넌트는 통계 대시보드 페이지의 요약 정보를 카드 형태로 표시합니다.
 *
 * 주요 기능:
 * 1. 전체 관광지 수 표시
 * 2. Top 3 지역 표시
 * 3. Top 3 타입 표시
 * 4. 마지막 업데이트 시간 표시
 *
 * @dependencies
 * - components/ui/card.tsx: Card 컴포넌트
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 * - lucide-react: 아이콘
 * - lib/types/stats.ts: StatsSummary 타입
 *
 * @see {@link docs/PRD.md} - 통계 대시보드 요구사항
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Map, Tag, Clock, TrendingUp } from 'lucide-react';
import type { StatsSummary } from '@/lib/types/stats';

interface StatsSummaryCardsProps {
  summary: StatsSummary;
}

/**
 * 통계 요약 카드 컴포넌트
 * 전체 관광지 수, Top 3 지역, Top 3 타입, 마지막 업데이트 시간을 표시합니다.
 */
export function StatsSummaryCards({ summary }: StatsSummaryCardsProps) {
  const { totalCount, topRegions, topTypes, lastUpdated } = summary;

  return (
    <div className="space-y-6">
      {/* 요약 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 전체 관광지 수 카드 */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 관광지
            </CardTitle>
            <MapPin
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <div
              className="text-3xl font-bold"
              aria-label={`전체 관광지 ${totalCount.toLocaleString('ko-KR')}개`}
            >
              {totalCount.toLocaleString('ko-KR')}
              <span className="text-lg font-normal text-muted-foreground ml-1">
                개
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              전국 등록 관광지 수
            </p>
          </CardContent>
          {/* 배경 장식 */}
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/5" aria-hidden="true" />
        </Card>

        {/* Top 3 지역 카드 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top 3 지역
            </CardTitle>
            <Map
              className="h-5 w-5 text-blue-500"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2" role="list" aria-label="관광지가 가장 많은 Top 3 지역">
              {topRegions.map((region, index) => (
                <li
                  key={region.areaCode}
                  className="flex items-center justify-between"
                  role="listitem"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : index === 1
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}
                      aria-label={`${index + 1}위`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium">{region.areaName}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {region.count.toLocaleString('ko-KR')}개
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Top 3 타입 카드 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top 3 타입
            </CardTitle>
            <Tag
              className="h-5 w-5 text-green-500"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2" role="list" aria-label="가장 많은 관광 타입 Top 3">
              {topTypes.map((type, index) => (
                <li
                  key={type.contentTypeId}
                  className="flex items-center justify-between"
                  role="listitem"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : index === 1
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}
                      aria-label={`${index + 1}위`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium">{type.typeName}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {type.count.toLocaleString('ko-KR')}개
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 마지막 업데이트 시간 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <span>
          마지막 업데이트:{' '}
          <time dateTime={new Date(lastUpdated).toISOString()}>
            {new Date(lastUpdated).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </span>
      </div>
    </div>
  );
}

/**
 * 통계 요약 카드 스켈레톤 컴포넌트
 * 로딩 상태를 표시합니다.
 */
export function StatsSummarySkeleton() {
  return (
    <div className="space-y-6" aria-label="통계 로딩 중" role="status" aria-busy="true">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 전체 관광지 수 카드 스켈레톤 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>

        {/* Top 3 지역 카드 스켈레톤 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 타입 카드 스켈레톤 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 마지막 업데이트 시간 스켈레톤 */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

