import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Alert,
  Stack,
  Anchor,
  Paper
} from "@mantine/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const location = useLocation();
  const from = location.state?.from || '/trip';

  async function handleLogin() {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setErrorMessage(null);
    setIsLoggingIn(true);
    try {
      await loginUser(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Login failed. Please check your email and password.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <Container size={420} my={60}>
      <Title ta="center" order={1} mb={4}>
        Welcome back ✈️
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Don't have an account?{" "}
        <Anchor component={Link} to="/register" size="sm">
          Create one
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="md">
          {errorMessage && (
            <Alert title="Login Error" color="red" radius="md">
              {errorMessage}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Button
            fullWidth
            mt="sm"
            size="md"
            onClick={handleLogin}
            loading={isLoggingIn}
          >
            Sign In
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}