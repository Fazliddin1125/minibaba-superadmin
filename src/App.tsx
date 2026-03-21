import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { CategoriesPage } from "./pages/CategoriesPage"
import { ShopsPage } from "./pages/ShopsPage"
import LoginPage from "./pages/Auth/Login"
import DashboardPage from "./pages/Dashboard/DashBoardPage"
import LanguagesPage from "./pages/LanguagesPage"
import CharacteristicsList from "./pages/Characteristics/CharacteristicsList"
import CharacteristicsAdd from "./pages/Characteristics/CharacteristicsAdd"
import EditCharacteristicsPage from "./pages/Characteristics/CharacteristicsEdit"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/login" />

        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage/>} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/characteristics" element={<CharacteristicsList />} />
          <Route path="/characteristics/add" element={<CharacteristicsAdd />} />
          <Route path="/characteristics/edit" element={<EditCharacteristicsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
