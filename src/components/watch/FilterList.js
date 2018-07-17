import React from 'react'
import {ListGroup} from 'react-bootstrap'
import { JsonPre } from '../generic/JsonToggle';
import _ from 'lodash'

export default function FilterList({value, onRemove}) {
    return (
      <ListGroup>
          {
              _.map(value, v => <li className="list-group-item" key={v.key}>
                    <h4 className="list-group-item-heading">{v.key}{' '}
                        <button onClick={()=>onRemove(v.key)} className="btn">
                            <span className="glyphicon glyphicon-remove" />
                        </button>
                    </h4>
                  <JsonPre value={v}/>
            </li>)
          }
      </ListGroup>
      )
}