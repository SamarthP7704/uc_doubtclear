import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../services/authService';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const SettingsModal = ({ user, onClose }) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
    profileVisibility: 'public',
    showActivity: true
  });

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService?.signOut();
      await signOut?.();
      window.location.href = '/student-login';
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Here you would save settings to your backend
      // await userService.updateSettings(user.id, settings);
      console.log('Settings saved:', settings);
      onClose?.();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about new answers and updates</p>
                </div>
                <Checkbox
                  checked={settings?.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
                <Checkbox
                  checked={settings?.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Weekly summary of your activity and trending topics</p>
                </div>
                <Checkbox
                  checked={settings?.weeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
                <select
                  value={settings?.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e?.target?.value)}
                  className="px-3 py-1 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="public">Public</option>
                  <option value="students">UC Students Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Show Activity</p>
                  <p className="text-sm text-muted-foreground">Display your recent questions and answers</p>
                </div>
                <Checkbox
                  checked={settings?.showActivity}
                  onCheckedChange={(checked) => handleSettingChange('showActivity', checked)}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                iconName="Download"
                className="justify-start"
              >
                Download My Data
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Shield"
                className="justify-start"
              >
                Privacy Policy
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="FileText"
                className="justify-start"
              >
                Terms of Service
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                iconName="LogOut"
                onClick={handleSignOut}
                loading={loading}
                className="justify-start border-error text-error hover:bg-error hover:text-error-foreground"
              >
                Sign Out
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Trash2"
                className="justify-start border-error text-error hover:bg-error hover:text-error-foreground"
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                    console.log('Delete account requested');
                  }
                }}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            loading={loading}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;