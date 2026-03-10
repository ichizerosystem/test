export const metadata = {
  title: 'わかりやすい計算機',
  description: 'Next.jsで作成したシンプルで分かりやすい計算機',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
