import { useState } from 'react'
import './App.css'

const user = {
  name: '田中 太郎',
  email: 'taro.tanaka@example.com',
  memberSince: '2021/04/10',
  plan: 'プレミアムプラン'
}

type DialogType = 'logout' | 'withdrawal'

const dialogContent: Record<DialogType, { title: string; body: string; actionLabel: string }> = {
  logout: {
    title: 'ログアウトしますか？',
    body: '他の端末からもログアウトされる場合があります。再度ご利用の際は再ログインが必要です。',
    actionLabel: 'ログアウト'
  },
  withdrawal: {
    title: '退会手続きを進めますか？',
    body: '退会すると登録情報や購入履歴が削除され、元に戻すことはできません。本当に退会してもよろしいですか？',
    actionLabel: '退会する'
  }
}

function App() {
  const [openDialog, setOpenDialog] = useState<DialogType | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleDecision = (type: DialogType) => {
    setOpenDialog(type)
    setFeedback('')
  }

  const confirmAction = () => {
    if (!openDialog) return
    const message = openDialog === 'logout' ? 'ログアウトしました。' : '退会手続きが完了しました。'
    setFeedback(message)
    setOpenDialog(null)
  }

  const closeDialog = () => setOpenDialog(null)

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="section-label">マイページ</p>
          <h1 className="title">こんにちは、{user.name}さん</h1>
          <p className="subtitle">アカウントの設定と利用状況を確認できます。</p>
        </div>
        <img
          className="avatar"
          src="https://avatars.githubusercontent.com/u/1?v=4"
          alt={`${user.name}のアイコン`}
        />
      </header>

      <section className="panel">
        <h2>アカウント情報</h2>
        <dl>
          <div>
            <dt>メールアドレス</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>会員登録日</dt>
            <dd>{user.memberSince}</dd>
          </div>
          <div>
            <dt>ご利用プラン</dt>
            <dd>{user.plan}</dd>
          </div>
        </dl>
      </section>

      <section className="panel actions">
        <h2>アカウント操作</h2>
        <div className="action-list">
          <button className="action-item" onClick={() => handleDecision('logout')}>
            <div>
              <p className="action-title">ログアウト</p>
              <p className="action-description">別のアカウントでログインする場合はこちら</p>
            </div>
            <span aria-hidden>›</span>
          </button>
          <button className="action-item danger" onClick={() => handleDecision('withdrawal')}>
            <div>
              <p className="action-title">退会手続き</p>
              <p className="action-description">登録情報を削除してサービスの利用を終了します</p>
            </div>
            <span aria-hidden>›</span>
          </button>
        </div>
      </section>

      {feedback && <p className="feedback">{feedback}</p>}

      {openDialog && (
        <div className="dialog-overlay" role="presentation" onClick={closeDialog}>
          <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>{dialogContent[openDialog].title}</h3>
            <p>{dialogContent[openDialog].body}</p>
            <div className="dialog-actions">
              <button className="secondary" onClick={closeDialog}>
                キャンセル
              </button>
              <button className="primary" onClick={confirmAction}>
                {dialogContent[openDialog].actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
