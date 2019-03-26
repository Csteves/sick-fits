import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE",
];

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION($userId:ID!, $permissions:[Permission]){
        updatePermissions(userId:$userId, permissions: $permissions){
            id
            email
            name
            permissions
        }
    }
`
const ALL_USERS_QUERY = gql`
    query {
        users{
            id
            name
            email
            permissions
        }
    }
`

const Permissions = (props) => (
    <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => console.log(data) || (
            <div>
                <Error error={error} />
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            {possiblePermissions.map(permission => (<th key={permission}>{permission}</th>))}
                            <th>👇</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.map(user => <UserPermissions key={user.id} user={user} />)}
                    </tbody>
                </Table>
            </div>
        )}
    </Query>
);


class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions: PropTypes.array,
        }).isRequired,
    };
    state = {
        permissions: this.props.user.permissions,
    };

    handlePermissionChange = (e) => {
        const checkBox = e.target;
        let permissionsCopy = [...this.state.permissions];
        if (permissionsCopy.includes(checkBox.value)) {
            permissionsCopy = permissionsCopy.filter(permission => permission !== checkBox.value);

        } else {
            permissionsCopy.push(e.target.value);
        }
        this.setState({ permissions: permissionsCopy })
    };

    render() {
        const user = this.props.user;
        return (
            <Mutation
            mutation={UPDATE_PERMISSIONS_MUTATION}
            variables={{
                permissions: this.state.permissions,
                userId: user.id,
            }}>
                {(updatePermissions, { loading, error }) => (
                    <>
                    {error && <tr> <td colSpan="8" > <Error error={error}/> </td> </tr>}
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        {possiblePermissions.map(permission => (
                            <td key={permission}>
                                <label htmlFor={`${user.id}-permission-${permission}`}>
                                    <input
                                        id={`${user.id}-permission-${permission}`}
                                        value={permission}
                                        onChange={(e) => (this.handlePermissionChange(e))}
                                        type="checkbox"
                                        checked={this.state.permissions.includes(permission)}
                                    />
                                </label>
                            </td>
                        ))}
                        <td>
                            <SickButton
                            type="button"
                            disabled={loading}
                            onClick={updatePermissions}
                            >
                                Updat{loading ? 'ing' : 'e'}
                   </SickButton>
                        </td>
                    </tr>
                </>
                )}
            </Mutation>
        )
    }
}
export default Permissions;