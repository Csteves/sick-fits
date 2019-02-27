import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description:String!
        $price:Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ){
            id
        }
    }
`
class CreateItem extends Component {
    state ={
        title:'',
        description:'',
        image:'',
        largeImage:'',
        price:0
    };
    handleChange = (e) =>{
        const {name,type,value} = e.target;
        let val = type === 'number' ? parseFloat(value) : value
        this.setState({[name]:val})
    }
    uploadFile = async(e) =>{
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');
        const res = await fetch('https://api.cloudinary.com/v1_1/dkhuytj2r/image/upload', {
            method: 'POST',
            body:data
        });
        const file = await res.json();
        console.log(file);
        this.setState({
            image: file.secure_url,
            largeImage:file.eager[0].secure_url
        })
    }
    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state} >
                {(createItem, {loading, error}) => (
            <Form onSubmit={ async (e)=>{
                e.preventDefault();
                const res = await createItem(e.target.value)
                Router.push({
                    pathname:'/item',
                    query: {id:res.data.createItem.id}
                })
            }} >
              <Error error={error}/>
                <fieldset disabled={loading} aria-busy={loading} >
                    <h1>Sell an Item.</h1>
                    <label htmlFor="image">
                    Image
                    <input
                    type="file"
                    id="image"
                    name="image"
                    placeholder=""
                    onChange={this.uploadFile}
                    required
                    />
                    {this.state.image && <img src={this.state.image} alt='image preview' />}
                    </label>
                    <label htmlFor="title">
                    Title
                    <input
                    value={this.state.title}
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
                    value={this.state.price }
                    onChange={this.handleChange}
                    />
                    </label>
                    <label htmlFor="description">
                    <textarea
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Description of this item"
                    value={this.state.description}
                    onChange={this.handleChange}
                    />
                    </label>
                    <button type="submit" >Submit</button>
                </fieldset>
            </Form>
            )}
        </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };