import react from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id:ID!){
        addToCart(id: $id){
            id
            quantity
        }
    }
`;

class AddToCart extends react.Component{
render(){
    const {id} = this.props;
    return(
        <Mutation mutation={ADD_TO_CART_MUTATION} variables={
            {
                id:id
            }
        }>
            {(addToCart) =>(
                <button onClick={addToCart}>Add To Cart </button>
            )}
        </Mutation>
    )
}
}
export default AddToCart;