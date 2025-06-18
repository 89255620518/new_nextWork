import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import styles from './product.module.scss';

type Product = {
    id: number;
    title: string;
    price: number;
    image?: string;
    description?: string;
    };

    type BasketItem = Product & {
    quantity: number;
    };

    type ProductComponentProps = {
    onAddToBasket: (product: Product) => void;
    basketItems: BasketItem[];
    totalItems: number;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    };

    const ProductComponent = ({ 
    onAddToBasket, 
    basketItems = [], 
    totalItems,
    onUpdateQuantity 
    }: ProductComponentProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [visibleProducts, setVisibleProducts] = useState(6);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        try {
        const response = await axios.get('http://o-complex.com:1337/products/');
        setProducts(response.data?.items || []);
        setLoading(false);
        } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
        setError("Не удалось загрузить товары");
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const getBasketItem = useCallback(
        (productId: number) => basketItems.find(item => item.id === productId),
        [basketItems]
    );

    const handleIncrement = (product: Product) => {
        const basketItem = getBasketItem(product.id);
        if (basketItem) {
        onUpdateQuantity(product.id, basketItem.quantity + 1);
        } else {
        onAddToBasket(product);
        }
    };

    const handleDecrement = (product: Product) => {
        const basketItem = getBasketItem(product.id);
        if (basketItem && basketItem.quantity > 1) {
        onUpdateQuantity(product.id, basketItem.quantity - 1);
        } else {
        onUpdateQuantity(product.id, 0);
        }
    };

    const loadMoreProducts = () => {
        setVisibleProducts(prev => prev + 6);
    };

    if (loading) return <div className={styles.loading}>Загрузка товаров...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.containerProductComponent}>
        <nav className={styles.nav}>
            <Link href="/basket" className={styles.navLink}>
            <span className={styles.navIcon}>🛒</span>
            <span>Корзина ({basketItems.length})</span>
            </Link>
            
            <Link href="/" className={styles.navLink}>
            <span className={styles.navIcon}>💬</span>
            <span>Отзывы</span>
            </Link>
        </nav>

        <div className={styles.productsWrapper}>
            <h1 className={styles.title}>Наши товары</h1>
            
            {products.length > 0 ? (
            <>
                <div className={styles.productsGrid}>
                {products.slice(0, visibleProducts).map(product => {
                    const basketItem = getBasketItem(product.id);
                    const quantity = basketItem?.quantity || 0;
                    
                    return (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.productImage}>
                        {product.image ? (
                            <img src={product.image} alt={product.title} />
                        ) : (
                            <div className={styles.imagePlaceholder}>🛍️</div>
                        )}
                        </div>
                        <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>{product.title}</h3>
                        <p className={styles.productDescription}>
                            {product.description || 'Описание отсутствует'}
                        </p>
                        <div className={styles.productFooter}>
                            <span className={styles.productPrice}>
                            {product.price ? `${product.price} ₽` : 'Цена не указана'}
                            </span>
                            
                            {quantity > 0 ? (
                            <div className={styles.quantityControls}>
                                <button 
                                onClick={() => handleDecrement(product)}
                                className={styles.quantityButton}
                                >
                                -
                                </button>
                                <span className={styles.quantityValue}>
                                {quantity}
                                </span>
                                <button 
                                onClick={() => handleIncrement(product)}
                                className={styles.quantityButton}
                                >
                                +
                                </button>
                            </div>
                            ) : (
                            <button
                                onClick={() => handleIncrement(product)}
                                className={styles.addButton}
                            >
                                Добавить
                            </button>
                            )}
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>

                {visibleProducts < products.length && (
                <div className={styles.loadMoreContainer}>
                    <button 
                    onClick={loadMoreProducts}
                    className={styles.loadMoreButton}
                    >
                    Показать еще
                    </button>
                </div>
                )}
            </>
            ) : (
            <div className={styles.noProducts}>Товары отсутствуют</div>
            )}
        </div>
        </div>
    );
};

export default ProductComponent;