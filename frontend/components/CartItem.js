import React from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CartItemStyles = styled.div`
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display:grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    img{
        margin-right: 10px;
    }
    h3{
        margin: 0;
    }
`;

const CartItem = ({cart}) => (
    <CartItemStyles>
        <img width='100' src={cart.item.image} alt={cart.item.title}/>
        <div>
            <h3>{cart.item.title}</h3>
            <p>{formatMoney((cart.quantity * cart.item.price))}{" - "}
            <em>
                {cart.quantity} x {formatMoney(cart.item.price)}each
            </em>
            </p>
        </div>


    </CartItemStyles>
)

CartItem.propTypes = {
    cartItem: PropTypes.object.isRequired,
}

export default CartItem;