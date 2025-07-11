import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Save, Edit, X } from "lucide-react";

const ProfileSection = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    farm_location: profile?.farm_location || '',
    phone_number: profile?.phone_number || '',
    farm_size: profile?.farm_size?.toString() || '',
    farm_size_unit: profile?.farm_size_unit || 'hectares',
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    const updates = {
      full_name: formData.full_name,
      farm_location: formData.farm_location,
      phone_number: formData.phone_number,
      farm_size: formData.farm_size ? parseFloat(formData.farm_size) : undefined,
      farm_size_unit: formData.farm_size_unit,
    };

    const { error } = await updateProfile(updates);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      farm_location: profile?.farm_location || '',
      phone_number: profile?.phone_number || '',
      farm_size: profile?.farm_size?.toString() || '',
      farm_size_unit: profile?.farm_size_unit || 'hectares',
    });
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-grass-50 to-green-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-grass-600" />
            <div>
              <CardTitle className="text-lg sm:text-xl text-grass-800">Profile Information</CardTitle>
              <CardDescription className="text-sm sm:text-base text-grass-700">
                Manage your account details and farm information
              </CardDescription>
            </div>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-grass-300 hover:bg-grass-50"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                size="sm"
                disabled={isLoading}
                className="bg-grass-600 hover:bg-grass-700 flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm sm:text-base font-medium text-gray-700">
              Full Name *
            </Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-grass-500 focus:border-grass-500"
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profile.full_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base font-medium text-gray-700">
              Email Address
            </Label>
            <p className="text-sm sm:text-base text-gray-500 py-2 px-3 bg-gray-100 rounded-md">
              {profile.email} (Cannot be changed)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm_location" className="text-sm sm:text-base font-medium text-gray-700">
              Farm Location
            </Label>
            {isEditing ? (
              <Input
                id="farm_location"
                value={formData.farm_location}
                onChange={(e) => handleChange('farm_location', e.target.value)}
                placeholder="e.g., Mumbai, Maharashtra"
                className="transition-all duration-300 focus:ring-2 focus:ring-grass-500 focus:border-grass-500"
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profile.farm_location || 'Not specified'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm sm:text-base font-medium text-gray-700">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="e.g., +91 9876543210"
                className="transition-all duration-300 focus:ring-2 focus:ring-grass-500 focus:border-grass-500"
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profile.phone_number || 'Not specified'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm_size" className="text-sm sm:text-base font-medium text-gray-700">
              Farm Size
            </Label>
            {isEditing ? (
              <div className="flex space-x-2">
                <Input
                  id="farm_size"
                  type="number"
                  step="0.1"
                  value={formData.farm_size}
                  onChange={(e) => handleChange('farm_size', e.target.value)}
                  placeholder="e.g., 2.5"
                  className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-grass-500 focus:border-grass-500"
                />
                <Select
                  value={formData.farm_size_unit}
                  onValueChange={(value) => handleChange('farm_size_unit', value)}
                >
                  <SelectTrigger className="w-32 transition-all duration-300 focus:ring-2 focus:ring-grass-500 focus:border-grass-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {profile.farm_size 
                  ? `${profile.farm_size} ${profile.farm_size_unit || 'hectares'}`
                  : 'Not specified'
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-gray-700">
              Member Since
            </Label>
            <p className="text-sm sm:text-base text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your email address cannot be changed for security reasons. 
              If you need to change your email, please contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;