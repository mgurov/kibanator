import React from 'react'
import { Grid } from 'react-bootstrap'
import _ from 'lodash'
import DataRow from './DataRow'

function DataList(props) {
    return (<Grid fluid={true}>
        {_.map(props.data, o => <DataRow 
            key={o.id} 
            data={o} 
            removeTillThis={() => props.ackTillId(o.id)}
            toggleFavorite={() => props.toggleFavorite(o.id)}
             />)}
    </Grid>)
}

export default DataList;