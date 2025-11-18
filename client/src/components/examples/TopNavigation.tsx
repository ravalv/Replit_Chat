import TopNavigation from '../TopNavigation';

export default function TopNavigationExample() {
  return (
    <TopNavigation
      username="John Doe"
      role="Operations Team"
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
