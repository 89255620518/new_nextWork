import Head from 'next/head';
import ProductComponent from '../component/Product/ProductComponent';
import { useBasket } from '../hooks/useBasket';

const Product = () => {
    const { 
        basketItems, 
        addToBasket, 
        totalItems, 
        updateQuantity 
    } = useBasket();

    return (
        <div>
            <Head>
                <title>Меню Товаров</title>
                <meta name="description" content="Наши товары" />
            </Head>
            <ProductComponent
                onAddToBasket={addToBasket}
                basketItems={basketItems}
                totalItems={totalItems}
                onUpdateQuantity={updateQuantity}
            />
        </div>
    );
};

export default Product;