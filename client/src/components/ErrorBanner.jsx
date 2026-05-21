import { useEffect, useState } from 'react'
import { dismiss, getCurrent, subscribe } from '../errorBus.js'
import styles from './ErrorBanner.module.css'

const MESSAGES = {
  INVALID_TOKEN: {
    title: 'GitHub 토큰이 유효하지 않습니다.',
    detail: 'server/.env의 GITHUB_TOKEN 값을 확인하세요.',
  },
  MISSING_TOKEN: {
    title: 'GitHub 토큰이 설정되지 않았습니다.',
    detail: 'server/.env에 GITHUB_TOKEN을 추가한 뒤 서버를 재시작하세요.',
  },
  RATE_LIMIT_OR_FORBIDDEN: {
    title: 'GitHub API 요청 한도에 도달했거나 권한이 없습니다.',
    detail: '잠시 후 다시 시도하거나, 토큰의 권한 범위(scope)를 확인하세요.',
  },
  NETWORK: {
    title: '서버에 연결할 수 없습니다.',
    detail: '백엔드(http://localhost:3001)가 실행 중인지 확인하세요.',
  },
}

export default function ErrorBanner() {
  const [err, setErr] = useState(getCurrent())

  useEffect(() => subscribe(setErr), [])

  if (!err) return null

  const info = MESSAGES[err.code] ?? {
    title: '오류가 발생했습니다.',
    detail: err.message,
  }

  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon} aria-hidden>
        !
      </span>
      <div className={styles.body}>
        <p className={styles.title}>{info.title}</p>
        {info.detail && <p className={styles.detail}>{info.detail}</p>}
      </div>
      <button type="button" className={styles.close} onClick={dismiss}>
        닫기
      </button>
    </div>
  )
}
