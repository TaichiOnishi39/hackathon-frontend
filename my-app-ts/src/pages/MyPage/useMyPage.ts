import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Product } from '../../features/product/components/ProductList/useProductList';

export const useMyPage = () => {
  // sellingProducts の state は削除しました
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      // 出品商品の fetch を削除し、購入といいねのみ取得するように変更
      const [resPurchased, resLiked] = await Promise.all([
        fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me/purchases', { headers }),
        fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me/likes', { headers }),
      ]);

      if (resPurchased.ok) setPurchasedProducts(await resPurchased.json() || []);
      if (resLiked.ok) setLikedProducts(await resLiked.json() || []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // deleteMyProduct, updateMyProduct も削除しました
  // (UserProductList コンポーネント側で処理するため不要です)

  useEffect(() => {
    fetchMyItems();
  }, []);

  return { purchasedProducts, likedProducts, loading };
};