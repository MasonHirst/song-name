import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import RequestPage from './components/request-view/RequestPage'
import DjPage from './components/dj-view/DjPage'
import { DjContextWrapper } from './context/DjContext'

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/request' element={<RequestPage />} />
        <Route
          path='/dj-portal'
          element={
            <DjContextWrapper>
              <DjPage />
            </DjContextWrapper>
          }
        />
        <Route path='*' element={<Navigate to='/request' />} />
      </Routes>
    </div>
  )
}

export default App
