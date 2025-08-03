import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import LoginForm from './components/LoginForm';
import SocialProofSection from './components/SocialProofSection';
import PlatformBenefits from './components/PlatformBenefits';

const StudentLogin = () => {
  return (
    <>
      <Helmet>
        <title>Student Login - UC DoubtClear</title>
        <meta name="description" content="Sign in to UC DoubtClear - Connect with fellow UC students, get quick answers to academic questions, and earn brownie points for helping others." />
        <meta name="keywords" content="UC login, student portal, academic help, university questions, peer learning" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="space-y-8">
              {/* Social Proof - Mobile */}
              <SocialProofSection />
              
              {/* Login Form - Mobile */}
              <LoginForm />
              
              {/* Platform Benefits - Mobile */}
              <div className="mt-12">
                <PlatformBenefits />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Benefits & Social Proof */}
              <div className="space-y-8">
                <PlatformBenefits />
                <SocialProofSection />
              </div>
              
              {/* Right Column - Login Form */}
              <div className="sticky top-8">
                <LoginForm />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border mt-16">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-4">UC DoubtClear</h3>
                <p className="text-sm text-muted-foreground">
                  Empowering UC students through collaborative learning and peer support.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Community Guidelines
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-3">Support</h4>
                <div className="space-y-2">
                  <a href="mailto:support@uc.edu" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    support@uc.edu
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Available 24/7 for UC students
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} University of Cincinnati. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default StudentLogin;