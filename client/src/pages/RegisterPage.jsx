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
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorHeader, setErrorHeader] = useState("");

  const from = location.state?.from || '/trip';

  async function handleRegister() {
    setErrorHeader("");
    if (!name || !email || !password) {
      setErrorHeader("Please fill in all fields.");
      return;
    }
    setIsRegistering(true);
    try {
      const res = await registerUser(email, password, name);
      if (res.user) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setErrorHeader(err.message || "Failed to create account");
    } finally {
      setIsRegistering(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleRegister();
  }

  return (
    <Container size={420} my={40}>
      <Title align="center" order={1}>
        Join useJetLag ✈️
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} to="/login" size="sm">
          Login here
        </Anchor>
      </Text>

      <Stack mt={30}>
        {errorHeader && (
          <Alert title="Wait!" color="red">
            {errorHeader}
          </Alert>
        )}

        <TextInput
          label="Full Name"
          placeholder="Explorer Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <PasswordInput
          label="Password"
          placeholder="Secure password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button
          fullWidth
          mt="xl"
          onClick={handleRegister}
          loading={isRegistering}
          color="grape"
          size="md"
        >
          Create Account
        </Button>
      </Stack>
    </Container>
  );
}
