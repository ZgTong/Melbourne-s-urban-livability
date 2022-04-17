import './App.scss';
import { Route, Routes, Navigate } from 'react-router-dom'
import Routers from './routers'

function App() {
  return (
    <div className="App">
      <Routes>
          {Routers.map((router) => (
              <Route
                  key={router.path}
                  path={router.path}
                  element={<router.component />}
                  exact={router.exact}
              />
          ))}
          <Route
              path="/home"
              element={<Navigate to="/" replace />}
          />
      </Routes>
    </div>
  );
}

export default App;
