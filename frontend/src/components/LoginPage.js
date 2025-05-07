
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const validateEmail = (email) => {
  // Simple email regex
  // eslint-disable-next-line
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/.test(email);
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    emailOrUsername: false,
    password: false,
  });
  const [errors, setErrors] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const validate = () => {
    let tempErrors = { emailOrUsername: '', password: '' };

    // Email/Username validation
    if (!values.emailOrUsername.trim()) {
      tempErrors.emailOrUsername = 'Email or username is required';
    } else if (
      values.emailOrUsername.includes('@') &&
      !validateEmail(values.emailOrUsername)
    ) {
      tempErrors.emailOrUsername = 'Please enter a valid email address';
    }

    // Password validation
    if (!values.password) {
      tempErrors.password = 'Password is required';
    }

    setErrors(tempErrors);
    return !tempErrors.emailOrUsername && !tempErrors.password;
  };

  React.useEffect(() => {
    if (touched.emailOrUsername || touched.password) {
      validate();
    }
    // eslint-disable-next-line
  }, [values]);

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
    validate();
  };

  const isFormValid = () => {
    return (
      values.emailOrUsername &&
      values.password &&
      !errors.emailOrUsername &&
      !errors.password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ emailOrUsername: true, password: true });
    if (validate()) {
      setLoading(true);
      setApiError('');
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailOrUsername: values.emailOrUsername,
            password: values.password,
          }),
        });
        if (response.ok) {
          // Assuming response contains JSON with success info
          // For example, token or user data
          // const data = await response.json();
          // Save token/session if needed
          // Redirect to dashboard or home page
          navigate('/dashboard');
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || 'Login failed');
        }
      } catch (error) {
        setApiError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          backgroundColor: 'white',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          Login
        </Typography>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        <TextField
          label="Email or Username"
          name="emailOrUsername"
          placeholder="Enter your email or username"
          variant="outlined"
          fullWidth
          value={values.emailOrUsername}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(touched.emailOrUsername && errors.emailOrUsername)}
          helperText={
            touched.emailOrUsername && errors.emailOrUsername
              ? errors.emailOrUsername
              : ' '
          }
          autoComplete="username"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          variant="outlined"
          fullWidth
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(touched.password && errors.password)}
          helperText={
            touched.password && errors.password ? errors.password : ' '
          }
          autoComplete="current-password"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={!isFormValid() || loading}
          fullWidth
          sx={{
            mt: 2,
            position: 'relative',
            '&:disabled': {
              backgroundColor: 'grey.400',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Login'
          )}
        </Button>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Link component={RouterLink} to="/register" variant="body2">
            Register
          </Link>
          <Link component={RouterLink} to="/forgot-password" variant="body2">
            Forgot Password?
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
