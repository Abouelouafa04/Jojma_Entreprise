import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index';
import { LanguageProvider } from './utils/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </AuthProvider>
  );
}
