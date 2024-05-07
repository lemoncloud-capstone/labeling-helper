import { Response } from 'express';

import { BaseResponseCode, BaseResponseMessages, BaseResponseStatus } from './errors';

// 응답 유틸리티 함수 구현
export function sendResponse<T>(res: Response, code: BaseResponseCode, result?: T, is_success: boolean = true) {
    const response: BaseResponseStatus = {
        isSuccess: is_success,
        code: code,
        message: BaseResponseMessages[code],
        result: result ? result : ({} as T), // result가 제공되지 않은 경우, 빈 객체를 기본값으로 설정
    };

    res.status(200).json(response); // HTTP 상태 코드는 성공을 나타내는 200을 사용
}
