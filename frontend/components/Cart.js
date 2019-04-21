import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import CartItem from './CartItem';
import calcCartTotal from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
    query{
        cartOpen @client
    }
`;
const TOGGLE_CART_MUTATION = gql`
    mutation{
        toggleCart @client
    }

`;

const Cart = (props) => (
    <User>{({data: {me}}) =>{
        if(!me) return null;
        console.log(me)
        return (
        <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
            <Mutation mutation={TOGGLE_CART_MUTATION}>
                {(toggleCart) => (
                    <CartStyles open={data.cartOpen} >
                        <header>
                            <CloseButton
                                onClick={toggleCart}
                                title='close'>&times;</CloseButton>
                            <Supreme>{me.name}'s Cart</Supreme>
                            <p>You Have {me.cart.length}  Item{me.cart.length > 1 ?'s':''} in your cart.</p>
                        </header>
                            <ul>
                                {me.cart.map(item =>(
                                    <CartItem
                                    key={item.id}
                                    cart={item}
                                    />
                                ))}
                            </ul>
                        <footer>
                            <p>{formatMoney(calcCartTotal(me.cart))}</p>
                            <SickButton>Check Out</SickButton>
                        </footer>
                    </CartStyles>

)}
            </Mutation>
        )}
    </Query>
        )
    }}</User>
);

export default Cart;
export {LOCAL_STATE_QUERY,TOGGLE_CART_MUTATION}