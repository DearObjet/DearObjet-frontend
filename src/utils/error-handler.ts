import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  message?: string;
  statusCode?: number;
  error?: string;
}

/**
 * RTK Query의 FetchBaseQueryError 타입인지 확인
 */
export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === 'object' && error != null && 'status' in error;
};

/**
 * message 속성을 가진 에러인지 확인
 */
export const isErrorWithMessage = (
  error: unknown
): error is { message: string } => {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
};

/**
 * 다양한 에러 타입에서 에러 메시지를 추출
 * @param error - 처리할 에러 객체
 * @param fallbackMessage - 기본 에러 메시지
 * @returns 추출된 에러 메시지
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string = '알 수 없는 오류가 발생했습니다'
): string => {
  // RTK Query 에러
  if (isFetchBaseQueryError(error)) {
    const errData = error.data as ApiErrorResponse;
    return errData?.message || `에러 코드: ${error.status}`;
  }

  // message 속성이 있는 에러
  if (isErrorWithMessage(error)) {
    return error.message;
  }

  // 표준 Error 객체
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
