import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';


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
    <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
            <Mutation mutation={TOGGLE_CART_MUTATION}>
                {(toggleCart) => (
                    <CartStyles open={data.cartOpen} >
                        <header>
                            <CloseButton
                                onClick={toggleCart}
                                title='close'>&times;</CloseButton>
                            <Supreme>Your Cart</Supreme>
                            <p>You Have __ Items in your cart.</p>
                        </header>

                        <footer>
                            <p>$10.10</p>
                            <SickButton>Check Out</SickButton>
                        </footer>
                    </CartStyles>

                )}
            </Mutation>
        )}
    </Query>
)

export default Cart;
export {LOCAL_STATE_QUERY,TOGGLE_CART_MUTATION}