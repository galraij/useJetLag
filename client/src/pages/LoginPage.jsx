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
  Anchor
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  // שימי לב: שיניתי מ-onLogin ל-loginUser כדי שיתאים ל-Hook שלך
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  async function handleLogin() {
    setIsLoginError(false);
    setIsLoggingIn(true);
    try {
      // כאן משתמשים בפונקציה מה-Hook
      await loginUser(email, password);
      navigate('/my-feed');
    } catch (err) {
      console.error(err);
      setIsLoginError(true);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <Container size={420} my={40}>
      <Title align="center" order={1}>
        Login to useJetLag App
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        or{" "}
        <Anchor component={Link} to="/signup" size="sm">
          create an account
        </Anchor>
      </Text>

      <Stack mt={30}>
        {isLoginError && (
          <Alert title="Error" color="red">
            Login error! Incorrect email or password
          </Alert>
        )}

        <TextInput
          label="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          mt="xl"
          onClick={handleLogin}
          loading={isLoggingIn}
        >
          Login
        </Button>
      </Stack>
    </Container>
  );
}