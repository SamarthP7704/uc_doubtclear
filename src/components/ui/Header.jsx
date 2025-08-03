import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/browse-questions?search=${encodeURIComponent(searchQuery?.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
      navigate('/student-login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const handleNotificationMenuToggle = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const closeMenus = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.dropdown-menu')) {
        closeMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuthPage = location.pathname === '/user-registration' || location.pathname === '/student-login';

  if (isAuthPage) {
    return (
      <header className="bg-card border-b border-border sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/images/b7b69c8f511007cff204cafa107de414-1753977434089.png" 
                alt="UC Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-semibold text-foreground">UC DoubtClear</span>
            </Link>
            
            {/* Auth Page Navigation */}
            <div className="flex items-center space-x-4">
              {location.pathname === '/student-login' ? (
                <Link to="/user-registration">
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </Link>
              ) : (
                <Link to="/student-login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/student-dashboard" className="flex items-center space-x-3">
              <img 
                src="/assets/images/b7b69c8f511007cff204cafa107de414-1753977434089.png" 
                alt="UC Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-semibold text-foreground">UC DoubtClear</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/student-dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/student-dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/browse-questions" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/browse-questions' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Browse Questions
              </Link>
              <Link 
                to="/ask-question" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/ask-question' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Ask Question
              </Link>
              <Link 
                to="/user-profile" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/user-profile' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                My Questions
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchToggle}
                className="md:hidden"
              >
                <Icon name="Search" size={20} />
              </Button>

              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative dropdown-menu">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleNotificationMenuToggle}
                      className={isNotificationMenuOpen ? 'bg-muted' : ''}
                    >
                      <Icon name="Bell" size={20} />
                    </Button>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">3</span>
                    </div>
                    
                    {/* Notification Dropdown */}
                    {isNotificationMenuOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                        <div className="p-4 border-b border-border">
                          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <div className="p-3 hover:bg-muted cursor-pointer border-b border-border">
                            <p className="text-sm text-foreground">New answer on your question</p>
                            <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                          </div>
                          <div className="p-3 hover:bg-muted cursor-pointer border-b border-border">
                            <p className="text-sm text-foreground">Your answer was marked as helpful</p>
                            <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                          </div>
                          <div className="p-3 hover:bg-muted cursor-pointer">
                            <p className="text-sm text-foreground">Weekly digest available</p>
                            <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                          </div>
                        </div>
                        <div className="p-3 border-t border-border text-center">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View All Notifications
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Menu */}
                  <div className="relative dropdown-menu">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleProfileMenuToggle}
                      className={isProfileMenuOpen ? 'bg-muted' : ''}
                    >
                      <Icon name="User" size={20} />
                    </Button>
                    
                    {/* Profile Dropdown */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                        <div className="p-4 border-b border-border">
                          <p className="text-sm font-semibold text-foreground">
                            {userProfile?.full_name || user?.user_metadata?.full_name || 'Student'}
                          </p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link 
                            to="/user-profile" 
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                            onClick={closeMenus}
                          >
                            <Icon name="User" size={16} className="mr-3" />
                            View Profile
                          </Link>
                          <Link 
                            to="/user-profile" 
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                            onClick={closeMenus}
                          >
                            <Icon name="Settings" size={16} className="mr-3" />
                            Settings
                          </Link>
                          <Link 
                            to="/leaderboard" 
                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                            onClick={closeMenus}
                          >
                            <Icon name="Trophy" size={16} className="mr-3" />
                            Leaderboard
                          </Link>
                        </div>
                        <div className="border-t border-border py-2">
                          <button 
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-muted"
                          >
                            <Icon name="LogOut" size={16} className="mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Not authenticated - show login/register buttons */
                <div className="flex items-center space-x-2">
                  <Link to="/student-login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/user-registration">
                    <Button variant="default" size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Icon name="Menu" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Expandable Search Bar */}
      {isSearchExpanded && (
        <div className="bg-card border-b border-border md:hidden animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                id="search-input"
                type="text"
                placeholder="Search questions, courses, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Icon name="X" size={16} />
                </Button>
              )}
            </form>
          </div>
        </div>
      )}
      
      {/* Desktop Search Bar */}
      <div className="hidden md:block bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search questions, courses, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Header;