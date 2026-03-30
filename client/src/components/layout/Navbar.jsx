import { Group, Button, Text, Container, Box, Burger, Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  const navLinks = (
    <>
      <Button variant="subtle" component={Link} to="/explore" onClick={close}>Explore</Button>
      {isLoggedIn && <Button variant="subtle" component={Link} to="/trip" onClick={close}>My Trips</Button>}
      {isLoggedIn && (
        <Button 
          variant="filled" 
          component={Link} 
          to="/get-started-upload"
          radius="xl"
          color="blue"
          onClick={close}
        >
          New Trip
        </Button>
      )}

      {!isLoggedIn && <Button variant="subtle" component={Link} to="/login" onClick={close}>Login</Button>}
      
      {isLoggedIn
        ? <Button variant="outline" radius="xl" onClick={handleLogout}>Logout</Button>
        : <Button variant="filled" component={Link} to="/register" radius="xl" color="blue" onClick={close}>Sign Up</Button>
      }
    </>
  );

  return (
    <Box 
      component="nav" 
      style={{ 
        borderBottom: '1px solid var(--mantine-color-default-border)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: 'var(--mantine-color-body)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container size="lg">
        <Group justify="space-between" h={64}>
          <Text 
            fw={800} 
            size="xl" 
            component={Link} 
            to="/" 
            onClick={close}
            style={{ 
              textDecoration: 'none', 
              color: 'var(--mantine-color-text)',
              letterSpacing: '-0.5px'
            }}
          >
            useJetLag ✈️
          </Text>
          
          <Group gap="xs" visibleFrom="sm">
            {navLinks}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
        </Group>

        <Collapse in={opened} hiddenFrom="sm">
          <Stack gap="xs" pb="md">
            {navLinks}
          </Stack>
        </Collapse>
      </Container>
    </Box>
  );
}

