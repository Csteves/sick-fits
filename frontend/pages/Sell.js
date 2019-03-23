import CreateItem from '../components/CreateItem';
import PleaseSignIn from '../components/PleaseSignIn';

const sell = props => {
    return(
    <>
      <PleaseSignIn>
        <CreateItem/>
      </PleaseSignIn>
    </>
    )

}

export default sell;