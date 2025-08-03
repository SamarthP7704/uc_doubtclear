import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar_url: user?.avatar_url || ''
    }
  });

  const watchedAvatarUrl = watch('avatar_url');

  const handleAvatarChange = (e) => {
    const url = e?.target?.value;
    setValue('avatar_url', url, { shouldDirty: true });
    setAvatarPreview(url);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onSave?.(data);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase() || 'U';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  onError={() => setAvatarPreview('')}
                />
              ) : (
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-border">
                  <span className="text-xl font-bold text-primary">
                    {getInitials(watch('full_name'))}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Profile Picture</p>
          </div>

          {/* Avatar URL Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Avatar URL
            </label>
            <Input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              {...register('avatar_url')}
              onChange={handleAvatarChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a URL to your profile picture
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              placeholder="Enter your full name"
              {...register('full_name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              error={errors?.full_name?.message}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your.email@mail.uc.edu"
              {...register('email')}
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed from this page
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              {...register('bio', {
                maxLength: {
                  value: 200,
                  message: 'Bio must be less than 200 characters'
                }
              })}
            />
            {errors?.bio && (
              <p className="text-sm text-error mt-1">{errors?.bio?.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {watch('bio')?.length || 0}/200 characters
            </p>
          </div>
        </form>

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
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;