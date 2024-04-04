import { Response } from 'express';

// 공통 응답 포맷 정의
interface ApiResponse<T> {
    is_success: boolean;
    code: number;
    message: string;
    result: T;
}

// 응답 유틸리티 함수 구현
export function sendResponse<T>(res: Response, code: number, message: string, result?: T, is_success: boolean = true) {
    const response: ApiResponse<T> = {
        is_success: is_success,
        code: code,
        message: message,
        result: result ? result : ({} as T), // result가 제공되지 않은 경우, 빈 객체를 기본값으로 설정
    };

    res.status(200).json(response); // HTTP 상태 코드는 성공을 나타내는 200을 사용
}
