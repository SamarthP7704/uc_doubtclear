import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import WelcomeHeader from './components/WelcomeHeader';
import RegistrationForm from './components/RegistrationForm';
import RegistrationBenefits from './components/RegistrationBenefits';

const UserRegistration = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - UC DoubtClear</title>
        <meta name="description" content="Join UC DoubtClear to connect with fellow students, get academic help, and earn points by contributing to the community." />
        <meta name="keywords" content="UC registration, student account, academic help, university questions" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Registration Form */}
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <WelcomeHeader />
                
                <div className="bg-card border border-border rounded-xl shadow-card p-6 md:p-8">
                  <RegistrationForm />
                </div>

                {/* Mobile Benefits Summary */}
                <div className="lg:hidden mt-8 p-6 bg-muted/30 rounded-lg border border-border">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-foreground">Join thousands of UC students</h3>
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">5K+</div>
                        <div className="text-xs text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-success">2K+</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">95%</div>
                        <div className="text-xs text-muted-foreground">Answered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits (Desktop Only) */}
              <div className="lg:sticky lg:top-8">
                <RegistrationBenefits />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">UC</span>
                </div>
                <span className="text-sm font-medium text-foreground">DoubtClear</span>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <span>University of Cincinnati</span>
                <span>•</span>
                <span>Academic Support Platform</span>
                <span>•</span>
                <span>© {new Date()?.getFullYear()}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-xs">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserRegistration;