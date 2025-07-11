import { supabase } from './supabaseClient';
import type { FertilizerRecommendation } from './supabaseClient';

export interface RecommendationInput {
  fieldName: string;
  fieldSize: number;
  fieldSizeUnit: string;
  cropType: string;
  soilType: string;
  soilPH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  mlPredictionFertilizer: string;
  mlPredictionConfidence: number;
  primaryFertilizerName: string;
  primaryFertilizerAmount: string;
  secondaryFertilizerName: string;
  secondaryFertilizerAmount: string;
  totalCostEstimate: string;
}

export class RecommendationService {
  static async saveRecommendation(userId: string, recommendation: RecommendationInput) {
    try {
      const { data, error } = await supabase
        .from('fertilizer_recommendations')
        .insert({
          user_id: userId,
          field_name: recommendation.fieldName,
          field_size: recommendation.fieldSize,
          field_size_unit: recommendation.fieldSizeUnit,
          crop_type: recommendation.cropType,
          soil_type: recommendation.soilType,
          soil_ph: recommendation.soilPH,
          nitrogen: recommendation.nitrogen,
          phosphorus: recommendation.phosphorus,
          potassium: recommendation.potassium,
          temperature: recommendation.temperature,
          humidity: recommendation.humidity,
          soil_moisture: recommendation.soilMoisture,
          ml_prediction_fertilizer: recommendation.mlPredictionFertilizer,
          ml_prediction_confidence: recommendation.mlPredictionConfidence,
          primary_fertilizer_name: recommendation.primaryFertilizerName,
          primary_fertilizer_amount: recommendation.primaryFertilizerAmount,
          secondary_fertilizer_name: recommendation.secondaryFertilizerName,
          secondary_fertilizer_amount: recommendation.secondaryFertilizerAmount,
          total_cost_estimate: recommendation.totalCostEstimate,
        })
        .select()
        .single();

      if (error) throw error;

      return { recommendation: data, error: null };
    } catch (error) {
      return { recommendation: null, error };
    }
  }

  static async getUserRecommendations(userId: string): Promise<{ recommendations: FertilizerRecommendation[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('fertilizer_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { recommendations: data || [], error: null };
    } catch (error) {
      return { recommendations: [], error };
    }
  }

  static async deleteRecommendation(recommendationId: string) {
    try {
      const { error } = await supabase
        .from('fertilizer_recommendations')
        .delete()
        .eq('id', recommendationId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}