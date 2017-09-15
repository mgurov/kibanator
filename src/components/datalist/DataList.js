import React from 'react'
import { Grid } from 'react-bootstrap'
import _ from 'lodash'
import DataRow from './DataRow'

function DataList(props) {
    let {ackTillId, data, ...rest} = props
    return (<Grid fluid={true}>
        {_.map(data, o => <DataRow 
            key={o.id} 
            data={o} 
            removeTillThis={ackTillId && (() => ackTillId(o.id))}
            {...rest}
             />)}
    </Grid>)
}

export default DataList;