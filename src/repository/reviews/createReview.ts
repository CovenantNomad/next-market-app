import { TReview } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import snakecaseKeys from 'snakecase-keys';

type Params = Omit<Omit<Omit<TReview, 'id'>, 'createdBy'>, 'createdAt'>

export async function createReview(
  supabase: SupabaseClient,
  params: Params
) {
  if (process.env.USE_MOCK_DATA === 'true') {
    return
  }

  const { error } = await supabase
    .from('reviews')
    .insert(snakecaseKeys(params))

  if (error) {
    throw error
  }

  return
}