import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/student-dashboard';

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    if (!formData?.email?.includes('@') || !formData?.email?.includes('.')) {
      setError('Please enter a valid UC email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Add null check for signIn function
      if (typeof signIn !== 'function') {
        console.error('signIn is not a function:', typeof signIn);
        setError('Authentication service is not available. Please refresh the page and try again.');
        return;
      }

      const result = await signIn(formData?.email, formData?.password);
      
      if (result?.error) {
        setError(result?.error?.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Check if sign in was successful
      if (result?.data?.user) {
        // Navigate to intended destination or dashboard
        navigate(from, { replace: true });
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement password reset
    navigate('/forgot-password');
  };

  const handleSignUpRedirect = () => {
    navigate('/user-registration', { 
      state: { from: location.state?.from } 
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            UC Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData?.email || ''}
            onChange={handleInputChange}
            placeholder="yourname@mail.uc.edu"
            disabled={isSubmitting}
            required
            className="w-full"
            autoComplete="email"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData?.password || ''}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isSubmitting}
              required
              className="w-full pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              disabled={isSubmitting}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
              disabled={isSubmitting}
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            disabled={isSubmitting}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSignUpRedirect}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Create one here
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: sarah.johnson@mail.uc.edu</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;