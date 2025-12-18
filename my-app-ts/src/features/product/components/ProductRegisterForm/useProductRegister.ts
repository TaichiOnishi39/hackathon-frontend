import { useState } from 'react';
import { getAuth } from 'firebase/auth';

export const useProductRegister = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [aiLoading, setAiLoading] = useState(false);

  // AI生成関数
  const generateDescription = async () => {
    if (!name.trim()) {
      alert("先に「商品名」を入力してください！");
      return;
    }
  // 簡易的にキーワードを聞く
  const keywords = window.prompt("商品の特徴を入力してください（例: 新品, 限定カラー, 箱あり）", "新品, 美品");
  if (keywords === null) return; // キャンセルされたら何もしない

  setAiLoading(true);
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();

    const res = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/products/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        name: name, 
        keywords: keywords 
      }),
    });

    if (!res.ok) throw new Error('AI生成に失敗しました');

    const data = await res.json();
    
    // 生成された文章をセット（既存の文章があれば改行して追記、なければそのまま）
    setDescription(prev => prev ? prev + "\n\n" + data.description : data.description);
    
  } catch (e: any) {
    console.error(e);
    alert(e.message);
  } finally {
    setAiLoading(false);
  }
};

  const registerProduct = async () => {
    setError('');

    if (!name.trim()) {
      setError("商品名を入力してください");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("正しい価格を入力してください");
      return;
    }

    if (!imageFile) {
        setError("商品画像を選択してください");
        return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();

      // ★変更点: FormData を使う
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price); // 文字列のままでOK（Go側で変換してくれる場合）または数値変換
      formData.append('description', description);
      // 画像があれば追加 ('image' はバックエンドで受け取るキー名)
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('https://hackathon-backend-80731441408.europe-west1.run.app/products', {
        method: 'POST',
        headers: {
          // ★重要: Content-Type: application/json は削除する！
          // ブラウザが自動で boundary を設定してくれます
          'Authorization': `Bearer ${token}`
        },
        body: formData, // JSON.stringify(body) ではなく formData をそのまま渡す
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '商品登録に失敗しました');
      }

      alert("商品を登録しました！");
      // フォームをクリア
      setName('');
      setPrice('');
      setDescription('');
      setImageFile(null); // 画像もクリア

      // ★ここ重要: input type="file" の値をリセットするために、
      // DOM要素を直接クリアするか、keyを変更するなどのテクニックが必要ですが
      // 今回は簡易的にそのままにします（見た目上ファイル名が残る場合があります）

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    price, setPrice,
    description, setDescription,
    imageFile, setImageFile, 
    registerProduct,
    loading,
    error,
    generateDescription, 
    aiLoading
  };
};