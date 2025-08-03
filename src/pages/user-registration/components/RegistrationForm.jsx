import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const from = location.state?.from?.pathname || '/student-dashboard';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData?.fullName?.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData?.email?.trim()) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!formData?.email?.includes('@mail.uc.edu')) {
      setError('Please use your UC email address (@mail.uc.edu)');
      return false;
    }
    
    if (!formData?.password) {
      setError('Please enter a password');
      return false;
    }
    
    if (formData?.password?.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData?.password !== formData?.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!formData?.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: signUpError } = await signUp(
        formData?.email,
        formData?.password,
        formData?.fullName
      );
      
      if (signUpError) {
        setError(signUpError?.message);
        return;
      }

      // Show success message and redirect
      navigate('/student-login', { 
        state: { 
          from: location.state?.from,
          message: 'Account created successfully! Please sign in.' 
        }
      });
      
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInRedirect = () => {
    navigate('/student-login', { 
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

        {/* Full Name Input */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData?.fullName || ''}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            required
            className="w-full"
            autoComplete="name"
          />
        </div>

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
          <p className="text-xs text-muted-foreground">
            Must be a valid UC email address ending with @mail.uc.edu
          </p>
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
              placeholder="Create a password"
              disabled={isSubmitting}
              required
              className="w-full pr-12"
              autoComplete="new-password"
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
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters long
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData?.confirmPassword || ''}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              disabled={isSubmitting}
              required
              className="w-full pr-12"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              disabled={isSubmitting}
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start space-x-3">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData?.agreeToTerms || false}
            onChange={handleInputChange}
            className="mt-1 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
            disabled={isSubmitting}
            required
          />
          <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground leading-5">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Sign Up Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            'Create Account'
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

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleSignInRedirect}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;