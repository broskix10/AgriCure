import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { RecommendationService } from "@/services/recommendationService";
import { useToast } from "@/hooks/use-toast";
import { History, Trash2, Calendar, Leaf, BarChart3, AlertCircle } from "lucide-react";
import type { FertilizerRecommendation } from "@/services/supabaseClient";

const RecommendationHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<FertilizerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    const { recommendations: data, error } = await RecommendationService.getUserRecommendations(user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load recommendation history.",
        variant: "destructive",
      });
    } else {
      setRecommendations(data);
    }

    setLoading(false);
  };

  const handleDelete = async (recommendationId: string) => {
    setDeletingId(recommendationId);
    
    const { error } = await RecommendationService.deleteRecommendation(recommendationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete recommendation.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Recommendation deleted successfully.",
      });
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    }

    setDeletingId(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 80) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-grass-600"></div>
          <span className="ml-2 text-sm sm:text-base">Loading recommendations...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-grass-50 to-green-50 rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-grass-800">
          <History className="h-5 w-5 sm:h-6 sm:w-6 text-grass-600" />
          <span>Fertilizer Recommendation History</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-grass-700">
          View and manage your past fertilizer recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 py-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't generated any fertilizer recommendations yet. 
              Use the ML Recommendations tab to get started.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Leaf className="h-4 w-4" />
              <span>Your recommendations will appear here once generated</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-base text-gray-600">
                Total recommendations: <span className="font-semibold text-grass-600">{recommendations.length}</span>
              </p>
              <Button
                onClick={loadRecommendations}
                variant="outline"
                size="sm"
                className="border-grass-300 hover:bg-grass-50"
              >
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {recommendations.map((recommendation, index) => (
                <Card 
                  key={recommendation.id} 
                  className="border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-grass-600" />
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800">
                          {recommendation.field_name}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getConfidenceColor(recommendation.ml_prediction_confidence)} text-xs border`}>
                          {recommendation.ml_prediction_confidence}% Confidence
                        </Badge>
                        <Button
                          onClick={() => handleDelete(recommendation.id)}
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === recommendation.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Field Size:</p>
                        <p className="font-medium">{recommendation.field_size} {recommendation.field_size_unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Crop Type:</p>
                        <p className="font-medium capitalize">{recommendation.crop_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Soil Type:</p>
                        <p className="font-medium capitalize">{recommendation.soil_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ML Prediction:</p>
                        <p className="font-medium text-grass-600">{recommendation.ml_prediction_fertilizer}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Primary Fertilizer:</p>
                        <p className="font-medium">{recommendation.primary_fertilizer_name}</p>
                        <p className="text-xs text-gray-500">{recommendation.primary_fertilizer_amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Cost:</p>
                        <p className="font-medium text-grass-600">{recommendation.total_cost_estimate}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>
                            {new Date(recommendation.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Soil pH: {recommendation.soil_ph} | 
                          N: {recommendation.nitrogen} | 
                          P: {recommendation.phosphorus} | 
                          K: {recommendation.potassium}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationHistory;