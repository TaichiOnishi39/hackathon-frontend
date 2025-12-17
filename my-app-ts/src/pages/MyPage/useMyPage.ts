import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Product } from '../../features/product/components/ProductList/useProductList';

export const useMyPage = () => {
  const [sellingProducts, setSellingProducts] = useState<Product[]>([]);
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

      const [resSelling, resPurchased, resLiked] = await Promise.all([
        fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me/products', { headers }),
        fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me/purchases', { headers }),
        fetch('https://hackathon-backend-80731441408.europe-west1.run.app/users/me/likes', { headers }),
      ]);

      if (resSelling.ok) setSellingProducts(await resSelling.json() || []);
      if (resPurchased.ok) setPurchasedProducts(await resPurchased.json() || []);
      if (resLiked.ok) setLikedProducts(await resLiked.json() || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMyProduct = async (productId: string) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("削除失敗");
      setSellingProducts(prev => prev.filter(p => p.id !== productId));
      alert("削除しました");
    } catch (e) {
      alert("削除できませんでした");
    }
  };

  const updateMyProduct = async (id: string, name: string, description: string, price: number) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return false;
      const token = await user.getIdToken();

      const res = await fetch(`https://hackathon-backend-80731441408.europe-west1.run.app/products?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, price }),
      });

      if (!res.ok) throw new Error("更新失敗");
      setSellingProducts(prev => prev.map(p => p.id === id ? { ...p, name, description, price } : p));
      alert("更新しました");
      return true;
    } catch (e) {
      alert("更新できませんでした");
      return false;
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  return { sellingProducts, purchasedProducts, likedProducts, loading, deleteMyProduct, updateMyProduct };
};