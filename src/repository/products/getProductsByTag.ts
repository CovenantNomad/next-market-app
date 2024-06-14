import { TProduct } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import camelcaseKeys from 'camelcase-keys';

export async function getProductsByTag(
  supabase: SupabaseClient,
  tag: string
): Promise<{ data: TProduct[]}> {

  if (process.env.USE_MOCK_DATA === 'true') {
    const { getMockProductData } = await import('@/lib/mock')
    const data: TProduct[] = Array.from({ length: 5 }).map(() => 
      getMockProductData({ tags: [tag] })
    )
  
    return { data }
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('tags', [tag])
    .is('purchase_by', null)

  if (error) {
    throw error
  }

  return { data: camelcaseKeys(data, { deep: true }) }
}