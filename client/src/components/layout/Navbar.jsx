import { Group, Button, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #eee' }}>
      <Text fw={700} size="lg" component={Link} to="/" style={{ textDecoration: 'none' }}>
        useJetLag ✈️
      </Text>
      <Group>
        <Button variant="subtle" component={Link} to="/explore">Explore</Button>
        <Button variant="subtle" component={Link} to="/login" >Login</Button>
        {isLoggedIn && <Button variant="subtle" component={Link} to="/my-feed">My Trips</Button>}
        {isLoggedIn && <Button variant="subtle" component={Link} to="/upload">New Trip</Button>}

        {user?.role === 'admin' && <Button variant="subtle" component={Link} to="/admin">Admin</Button>}
        {isLoggedIn
          ? <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
          : <Button component={Link} to="/login">Sign Up</Button>
        }
      </Group>
    </Group>
  );
}
