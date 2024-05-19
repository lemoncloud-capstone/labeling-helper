export interface BaseResponseStatus {
    isSuccess: boolean;
    code: number;
    message: string;
    result?: any;
}

export enum BaseResponseCode {
    /**
     * 1000 : Success
     */
    SUCCESS = 1000,

    /**
     * 2XXX : Common
     */
    BAD_REQUEST = 2000,
    INTERNAL_SERVER_ERROR = 2001,
    ValidationError = 2002,

    /**
     * 3XXX : User
     */
    GET_OAUTH_TOKEN_FAILED = 3000,
    GET_OAUTH_INFO_FAILED = 3001,
    INVALID_ROLE = 3002,
    FAIL_TO_UPDATE_ROLE = 3003,

    /**
     * 4XXX : Project
     */
    FAIL_TO_CREATE_PROJECT = 4000,
    FAIL_TO_GET_PROJECTS = 4001,
    FAIL_TO_GET_IMAGES = 4002,
    FAIL_TO_UPDATE_STATUS = 4003,
    FAIL_TO_DELETE_PROJECT = 4004,

    /**
     * 5XXX : ProjectImage
     */
    FAIL_TO_GET_S3_IMAGES = 5000,
    FAIL_TO_ASSIGN_WORKERS = 5001,
    FAIL_TO_APPROVAL_PROJECT = 5002,
    /**
     * 6XXX : Websocket
     */
}

export const BaseResponseMessages: Record<BaseResponseCode, string> = {
    /**
     * 1000 : Success
     */
    [BaseResponseCode.SUCCESS]: '요청에 성공했습니다.',

    /**
     * 2XXX : Common
     */
    [BaseResponseCode.BAD_REQUEST]: '잘못된 매개변수입니다.',
    [BaseResponseCode.INTERNAL_SERVER_ERROR]: '서버 내부 오류가 발생했습니다.',
    [BaseResponseCode.ValidationError]: '유효성 검사 오류가 발생했습니다.',

    /**
     * 3XXX : User
     */
    [BaseResponseCode.GET_OAUTH_TOKEN_FAILED]: 'oAuth 토큰 요청 실패',
    [BaseResponseCode.GET_OAUTH_INFO_FAILED]: 'oAuth Info 요청 실패',
    [BaseResponseCode.INVALID_ROLE]: '사용자 역할이 유효하지 않습니다.',
    [BaseResponseCode.FAIL_TO_UPDATE_ROLE]: '사용자 역할 업데이트 실패',

    /**
     * 4XXX : Project
     */
    [BaseResponseCode.FAIL_TO_CREATE_PROJECT]: '프로젝트 생성에 실패했습니다.',
    [BaseResponseCode.FAIL_TO_GET_PROJECTS]: '프로젝트 조회에 실패했습니다.',
    [BaseResponseCode.FAIL_TO_GET_IMAGES]: '프로젝트 이미지 조회에 실패했습니다.',
    [BaseResponseCode.FAIL_TO_UPDATE_STATUS]: '프로젝트 상태 업데이트에 실패했습니다.',
    [BaseResponseCode.FAIL_TO_DELETE_PROJECT]: '프로젝트 삭제에 실패했습니다.',

    /**
     * 5XXX : ProjectImage
     */
    [BaseResponseCode.FAIL_TO_GET_S3_IMAGES]: 'S3 이미지 조회에 실패했습니다.',
    [BaseResponseCode.FAIL_TO_ASSIGN_WORKERS]: '작업자 할당에 실패했습니다.',
    [BaseResponseCode.FAIL_TO_APPROVAL_PROJECT]: '프로젝트 승인에 실패했습니다.',
    /**
     * 6XXX : Websocket
     */
};
