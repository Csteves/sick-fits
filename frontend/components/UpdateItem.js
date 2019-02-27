import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { da } from 'date-fns/esm/locale';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id:ID!
        $title: String
        $description:String
        $price:Int
    ) {updateItem(
            id:$id
            title: $title
            description: $description
            price: $price
        ){
            id
            title
            description
            price
        }
    }
`
class UpdateItem extends Component {
    state = {};
    handleChange = (e) => {
        const { name, type, value } = e.target;
        let val = type === 'number' ? parseFloat(value) : value
        this.setState({ [name]: val })
    }
    updateItem = async(e,updateItemMutation)=>{
        e.preventDefault()
        console.log(this.state)
        const res = await updateItemMutation({
            variables:{
                id:this.props.id,
                ...this.state
            }
        });
        console.log('updated')
    }
    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{
                id: this.props.id
            }}>
                {({ data, loading }) => {
                    if(loading) return <p>Loading...</p>;
                    if(!data.item) return <p>{`No item found for id ${this.props.id}`}</p>
                    console.log(data)
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state} >
                            {(updateItem, { loading, error }) => (
                                <Form onSubmit={e => this.updateItem(e,updateItem)} >
                                    <Error error={error} />
                                    <fieldset disabled={loading} aria-busy={loading} >
                                        <h1>Sell an Item.</h1>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                defaultValue={data.item.title}
                                                onChange={this.handleChange}
                                                type="text"
                                                id="title"
                                                name="title"
                                                placeholder="title"
                                                required
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price {formatMoney(this.state.price)}
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                placeholder="0"
                                                defaultValue={data.item.price}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="description">
                                            <textarea
                                                type="text"
                                                id="description"
                                                name="description"
                                                placeholder="Description of this item"
                                                defaultValue={data.item.description}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <button type="submit" >Submit</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        );
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };