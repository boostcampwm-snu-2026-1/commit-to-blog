/**
 * 전역 에러 배너용 pub/sub.
 *
 * api.js의 request()가 외부 환경 문제(인증, rate limit, 네트워크)에 한해 notify를 호출한다.
 * 검증 실패(INVALID_INPUT) 같은 사용자 입력 에러는 페이지에서 직접 처리하므로 여기로 보내지 않는다.
 */

const listeners = new Set()
let current = null

export function notify(err) {
  current = err
  for (const fn of listeners) fn(err)
}

export function dismiss() {
  current = null
  for (const fn of listeners) fn(null)
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getCurrent() {
  return current
}
