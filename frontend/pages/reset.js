import Reset from '../components/Reset';
const reset = props => {
    return(
    <>
     <p>Reset Your Password {props.query.resetToken}</p>
     <Reset resetToken={props.query.resetToken}/>
    </>
    )

}

export default reset;