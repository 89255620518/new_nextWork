import { createContext, useContext, useEffect, useState } from 'react';

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

type BasketContextType = {
    basketItems: BasketItem[];
    addToBasket: (product: Product) => void;
    removeFromBasket: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearBasket: () => void;
    totalItems: number;
    totalPrice: number;
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

    // Загрузка из localStorage при монтировании
    useEffect(() => {
        const savedBasket = localStorage.getItem('basket');
        if (savedBasket) {
        setBasketItems(JSON.parse(savedBasket));
        }
    }, []);

    // Сохранение в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('basket', JSON.stringify(basketItems));
    }, [basketItems]);

    const addToBasket = (product: Product) => {
        setBasketItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
            item.id === product.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
        }
        return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromBasket = (productId: number) => {
        setBasketItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
        removeFromBasket(productId);
        return;
    }
    
    setBasketItems(prevItems =>
        prevItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
        )
    )
};

    const clearBasket = () => {
        setBasketItems([]);
    };

    const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = basketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <BasketContext.Provider
        value={{
            basketItems,
            addToBasket,
            removeFromBasket,
            updateQuantity,
            clearBasket,
            totalItems,
            totalPrice,
        }}
        >
        {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasket must be used within a BasketProvider');
    }
    return context;
};