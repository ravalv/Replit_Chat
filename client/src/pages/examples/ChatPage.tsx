import ChatPage from '../ChatPage';

export default function ChatPageExample() {
  return (
    <ChatPage
      username="John Doe"
      role="Operations Team"
      onLogout={() => console.log('Logout')}
    />
  );
}
