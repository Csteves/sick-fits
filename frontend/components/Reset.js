import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {PropTypes} from 'prop-types'
import Form from './styles/Form';
import Error from './ErrorMessage';
import {CURRENT_USER_QUERY} from './User';

const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken:String!, $password:String!, $confirmPassword:String!){
        resetPassword(resetToken:$resetToken, password:$password, confirmPassword:$confirmPassword){
            id
            email
            name
        }
    }
`

class SignIn extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    }

    state = {
        password:'',
        confirmPassword:''
    }

    saveToState = (e) => {
        const { name, value } = e.target;
        this.setState({[name]:value})
    }
    render() {
        let {resetToken} = this.props
        return (
            <Mutation
            mutation={RESET_MUTATION}
            variables={{
                resetToken,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            }}
            refetchQueries={[{query: CURRENT_USER_QUERY}]}
            >
                {(resetPassword,{error, loading, called }) => (
                        <Form
                        method='post'
                        onSubmit={async (e) => {
                            e.preventDefault()
                            await resetPassword()
                            this.setState({password:'',confirmPassword:''})
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Reset Password</h2>
                                <Error error={error}/>
                                <label htmlFor="password">
                                    New Pasword
                                <input
                                        type='password'
                                        name='password'
                                        placeholder='password'
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <label htmlFor="confirm password">
                                    Confirm Password
                                <input
                                        type='password'
                                        name='confirmPassword'
                                        placeholder="Confirm Password"
                                        value={this.state.confirmPassword}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Reset Your Password</button>
                            </fieldset>
                        </Form>
                    )
                }
            </Mutation>
        );
    }
}

export default SignIn;
export { RESET_MUTATION }