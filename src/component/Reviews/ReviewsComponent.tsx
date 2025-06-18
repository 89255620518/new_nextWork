import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './reviews.module.scss';

type Review = {
  id: number;
  text: string;
};

type ReviewsComponentProps = {
  basketItems: Array<{ id: number }>;
};

const ReviewsComponent = ({ basketItems }: ReviewsComponentProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await axios.get('http://o-complex.com:1337/reviews/');
        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка при загрузке данных отзывов:", err);
        setError("Не удалось загрузить отзывы");
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const createMarkup = (html: string) => {
    return { __html: html };
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/basket" className={styles.navLink}>
          <span className={styles.navIcon}>🛒</span>
          <span>Корзина ({basketItems.length})</span>
        </Link>
        
        <Link href="/product" className={styles.navLink}>
          <span className={styles.navIcon}>🍔</span>
          <span>Меню товаров</span>
        </Link>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>Отзывы наших клиентов</h1>
        
        {loading ? (
          <div className={styles.loader}>Загрузка отзывов...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <div 
                  className={styles.reviewContent}
                  dangerouslySetInnerHTML={createMarkup(review.text)}
                />
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewsComponent;