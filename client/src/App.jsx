import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import CreateBlog from './pages/CreateBlog.jsx'
import SavedPosts from './pages/SavedPosts.jsx'
import EditPost from './pages/EditPost.jsx'

const navStyle = ({ isActive }) => ({
  marginRight: '1rem',
  textDecoration: isActive ? 'underline' : 'none',
  color: isActive ? '#000' : '#555',
  fontWeight: isActive ? 600 : 400,
})

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <header style={{ borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: '0 0 0.5rem' }}>commit-to-blog</h1>
          <nav style={{ paddingBottom: '0.75rem' }}>
            <NavLink to="/" style={navStyle} end>
              새 글 만들기
            </NavLink>
            <NavLink to="/posts" style={navStyle}>
              저장된 글
            </NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CreateBlog />} />
            <Route path="/posts" element={<SavedPosts />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
