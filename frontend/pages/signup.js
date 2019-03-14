import styled from 'styled-components';
import SignIn from '../components/SignIn';
import Signup from '../components/Signup';

const Columns = styled.div`
    display:grid;
    grid-template-columns: repeat(auto-fit,minmax(300px, 1fr));
    grid-gap: 20px;
`
const signup = props => {
    return(
    <Columns>
      <Signup/>
      <SignIn/>
    </Columns>
    )

}

export default signup;