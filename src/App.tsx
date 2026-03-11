import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { CategoriesPage } from "./pages/CategoriesPage"
import { ShopsPage } from "./pages/ShopsPage"
import LoginPage from "./pages/Auth/Login"
import DashboardPage from "./pages/Dashboard/DashBoardPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/login" />

        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage/>} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/shops" element={<ShopsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
