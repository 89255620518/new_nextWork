import Head from 'next/head';
import BasketComponent from '../component/Basket/BasketComponent';
import { useBasket } from '../hooks/useBasket';

const Basket = () => {
    const { 
        basketItems, 
        removeFromBasket, 
        updateQuantity, 
        clearBasket 
    } = useBasket();

    return (
        <div>
            <Head>
                <title>Корзина</title>
                <meta name="description" content="Ваша корзина" />
            </Head>
            <BasketComponent
                items={basketItems}
                onRemove={removeFromBasket}
                onUpdateQuantity={updateQuantity}
                onClear={clearBasket}
            />
        </div>
    );
};

export default Basket;