import AuthPage from '../AuthPage';

export default function AuthPageExample() {
  return (
    <AuthPage
      onLogin={(username, password, role) => console.log('Login:', { username, password, role })}
      onRegister={(username, password, role) => console.log('Register:', { username, password, role })}
    />
  );
}
