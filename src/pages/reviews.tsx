import Head from 'next/head';
import ReviewsComponent from '../component/Reviews/ReviewsComponent';
import { useBasket } from '../hooks/useBasket';

const Reviews = () => {
    const { basketItems } = useBasket();

    return (
        <div>
        <Head>
            <title>Отзывы</title>
            <meta name="description" content="Отзывы наших клиентов" />
        </Head>
        <ReviewsComponent basketItems={basketItems} />
        </div>
    );
};

export default Reviews;