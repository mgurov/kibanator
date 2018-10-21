import React from 'react'
import {ListGroup, Button} from 'reactstrap'
import { JsonPre } from '../generic/JsonToggle';
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FilterList({value, onRemove}) {
    return (
      <ListGroup>
          {
              _.map(value, v => <li className="list-group-item" key={v.key}>
                    <h4 className="list-group-item-heading">{v.key}{' '}
                        <Button onClick={()=>onRemove(v.key)}>
                            <FontAwesomeIcon icon="trash-alt"/>
                        </Button>
                    </h4>
                  <JsonPre value={v}/>
            </li>)
          }
      </ListGroup>
      )
}