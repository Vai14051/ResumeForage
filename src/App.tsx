import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analyze from "./pages/Analyze";
import Optimize from "./pages/Optimize";
import History from "./pages/History";
const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? (<>{children}</>) : (
    <Navigate to="/login" />
  );

};

const PublicRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return !isAuthenticated ? (
    <>{children}</>
  ) : (

    <Navigate to="/login" />
  );
}


export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<PublicRoute>
          <Login />
        </PublicRoute>}



      />

      <Route
        path="/register"
        element={<PublicRoute>
          <Register />
        </PublicRoute>}

      />


      <Route
      path="/Dashboard"
      element={
        <ProtectedRoute>
            <Dashboard/>
        </ProtectedRoute>
      }
      
      
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload/>
          </ProtectedRoute>
        }  
      />

        <Route
        path="/analyze"
        element={
          <ProtectedRoute>
            <Analyze/>
          </ProtectedRoute>
        }
        
        
        />

        <Route
          path="/optimize"
          element={
            <ProtectedRoute>
              <Optimize/>
            </ProtectedRoute>
          }
        
        
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History/>
            </ProtectedRoute>
          }
        
        
        />



    </Routes>


  );
}