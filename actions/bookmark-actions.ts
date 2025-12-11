/**
 * @file bookmark-actions.ts
 * @description 북마크 관리를 위한 Server Actions
 *
 * 이 파일은 북마크 추가, 제거, 조회를 위한 Server Actions를 제공합니다.
 * Clerk 인증과 Supabase 데이터베이스를 연동합니다.
 *
 * 주요 기능:
 * 1. 북마크 조회 (특정 관광지)
 * 2. 북마크 추가
 * 3. 북마크 제거
 * 4. 사용자 북마크 목록 조회
 *
 * @dependencies
 * - lib/supabase/server.ts: createClerkSupabaseClient
 * - lib/supabase/service-role.ts: getServiceRoleClient (사용자 동기화용)
 * - @clerk/nextjs/server: auth, clerkClient
 */

'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';

/**
 * 북마크 타입 정의
 */
export interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

/**
 * Clerk userId를 Supabase users.id로 변환
 * 사용자가 없으면 동기화 후 반환
 *
 * @param clerkUserId - Clerk User ID
 * @returns Supabase User ID (UUID)
 */
async function getSupabaseUserId(clerkUserId: string): Promise<string> {
  const supabase = getServiceRoleClient();

  // users 테이블에서 clerk_id로 조회
  const { data: user, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkUserId)
    .single();

  if (user) {
    return user.id;
  }

  // 사용자가 없으면 동기화
  if (selectError && selectError.code === 'PGRST116') {
    // 사용자를 찾을 수 없음 - 동기화 필요
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkUserId);

    if (!clerkUser) {
      throw new Error('Clerk 사용자를 찾을 수 없습니다.');
    }

    // Supabase에 사용자 정보 동기화
    const { data: newUser, error: upsertError } = await supabase
      .from('users')
      .upsert(
        {
          clerk_id: clerkUser.id,
          name:
            clerkUser.fullName ||
            clerkUser.username ||
            clerkUser.emailAddresses[0]?.emailAddress ||
            'Unknown',
        },
        {
          onConflict: 'clerk_id',
        },
      )
      .select()
      .single();

    if (upsertError || !newUser) {
      throw new Error('사용자 동기화에 실패했습니다.');
    }

    return newUser.id;
  }

  throw new Error('사용자 조회에 실패했습니다.');
}

/**
 * 특정 관광지에 대한 북마크 조회
 *
 * @param contentId - 한국관광공사 API contentid
 * @returns 북마크 정보 또는 null
 */
export async function getBookmark(contentId: string): Promise<Bookmark | null> {
  try {
    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return null; // 인증되지 않은 사용자는 null 반환
    }

    // Supabase User ID 조회
    const supabaseUserId = await getSupabaseUserId(userId);

    // 북마크 조회
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', supabaseUserId)
      .eq('content_id', contentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 북마크 없음 - 정상적인 경우
        return null;
      }
      console.error('[getBookmark] 북마크 조회 실패:', error);
      throw new Error('북마크 조회에 실패했습니다.');
    }

    return data as Bookmark;
  } catch (error) {
    console.error('[getBookmark] 에러:', error);
    throw error;
  }
}

/**
 * 북마크 추가
 *
 * @param contentId - 한국관광공사 API contentid
 * @returns 추가된 북마크 정보
 */
export async function addBookmark(contentId: string): Promise<Bookmark> {
  try {
    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    // Supabase User ID 조회
    const supabaseUserId = await getSupabaseUserId(userId);

    // 북마크 추가
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: supabaseUserId,
        content_id: contentId,
      })
      .select()
      .single();

    if (error) {
      // UNIQUE 제약 위반 (이미 북마크된 경우)
      if (error.code === '23505') {
        throw new Error('이미 북마크된 관광지입니다.');
      }
      console.error('[addBookmark] 북마크 추가 실패:', error);
      throw new Error('북마크 추가에 실패했습니다.');
    }

    return data as Bookmark;
  } catch (error) {
    console.error('[addBookmark] 에러:', error);
    throw error;
  }
}

/**
 * 북마크 제거
 *
 * @param contentId - 한국관광공사 API contentid
 * @returns 성공 여부
 */
export async function removeBookmark(contentId: string): Promise<boolean> {
  try {
    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    // Supabase User ID 조회
    const supabaseUserId = await getSupabaseUserId(userId);

    // 북마크 제거
    const supabase = createClerkSupabaseClient();
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', supabaseUserId)
      .eq('content_id', contentId);

    if (error) {
      console.error('[removeBookmark] 북마크 제거 실패:', error);
      throw new Error('북마크 제거에 실패했습니다.');
    }

    return true;
  } catch (error) {
    console.error('[removeBookmark] 에러:', error);
    throw error;
  }
}

/**
 * 사용자의 모든 북마크 목록 조회
 *
 * @returns 북마크 목록
 */
export async function getUserBookmarks(): Promise<Bookmark[]> {
  try {
    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return []; // 인증되지 않은 사용자는 빈 배열 반환
    }

    // Supabase User ID 조회
    const supabaseUserId = await getSupabaseUserId(userId);

    // 북마크 목록 조회
    const supabase = createClerkSupabaseClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', supabaseUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getUserBookmarks] 북마크 목록 조회 실패:', error);
      throw new Error('북마크 목록 조회에 실패했습니다.');
    }

    return (data || []) as Bookmark[];
  } catch (error) {
    console.error('[getUserBookmarks] 에러:', error);
    throw error;
  }
}

