/*
  # User Authentication and Fertilizer Recommendations Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `farm_location` (text)
      - `phone_number` (text, optional)
      - `farm_size` (decimal, optional)
      - `farm_size_unit` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `fertilizer_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `field_name` (text)
      - `field_size` (decimal)
      - `field_size_unit` (text)
      - `crop_type` (text)
      - `soil_type` (text)
      - `soil_ph` (decimal)
      - `nitrogen` (decimal)
      - `phosphorus` (decimal)
      - `potassium` (decimal)
      - `temperature` (decimal)
      - `humidity` (decimal)
      - `soil_moisture` (decimal)
      - `ml_prediction_fertilizer` (text)
      - `ml_prediction_confidence` (integer)
      - `primary_fertilizer_name` (text)
      - `primary_fertilizer_amount` (text)
      - `secondary_fertilizer_name` (text)
      - `secondary_fertilizer_amount` (text)
      - `total_cost_estimate` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for users to read/write their own recommendations
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  farm_location text,
  phone_number text,
  farm_size decimal,
  farm_size_unit text DEFAULT 'hectares',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fertilizer_recommendations table
CREATE TABLE IF NOT EXISTS fertilizer_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  field_name text NOT NULL,
  field_size decimal NOT NULL,
  field_size_unit text NOT NULL DEFAULT 'hectares',
  crop_type text NOT NULL,
  soil_type text NOT NULL,
  soil_ph decimal NOT NULL,
  nitrogen decimal NOT NULL,
  phosphorus decimal NOT NULL,
  potassium decimal NOT NULL,
  temperature decimal NOT NULL,
  humidity decimal NOT NULL,
  soil_moisture decimal NOT NULL,
  ml_prediction_fertilizer text NOT NULL,
  ml_prediction_confidence integer NOT NULL,
  primary_fertilizer_name text NOT NULL,
  primary_fertilizer_amount text NOT NULL,
  secondary_fertilizer_name text NOT NULL,
  secondary_fertilizer_amount text NOT NULL,
  total_cost_estimate text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertilizer_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for fertilizer_recommendations
CREATE POLICY "Users can read own recommendations"
  ON fertilizer_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON fertilizer_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON fertilizer_recommendations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON fertilizer_recommendations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on user_profiles
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();