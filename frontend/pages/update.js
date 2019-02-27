import React from 'react';
import UpdateItem from '../components/UpdateItem';
const sell = ({query}) => {

    return(
    <>
      <UpdateItem id={query.id}/>
    </>
    )

}

export default sell;