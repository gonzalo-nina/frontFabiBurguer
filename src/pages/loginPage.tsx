// src/pages/LoginPage.tsx
import Login from '../components/login';

const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  return <Login onLogin={onLogin} error="" />;
};

export default LoginPage;