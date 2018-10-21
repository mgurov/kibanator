import React from 'react'
import TimeRangeControl from '../timerange/TimeRangeControl';
import HitsTimeline from '../datalist/HitsTimeline';
import {Link, Switch, Route} from 'react-router-dom'
import {Button} from 'reactstrap'
import EditConfig from './edit/EditConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LandingWatch({watchIndex}) {
    return <Switch>
        <Route path="/watch/new" component={EditConfig}/>
        <Route path="/watch/:watchIndex/edit" render={() => <EditConfig watchIndex={watchIndex} />}/>
        <Route path="/watch/:watchIndex" render={() => <ExistingWatch watchIndex={watchIndex} />}/>
    </Switch>
}

function ExistingWatch({watchIndex}) {
    return <div> watch: <EditLink watchIndex={watchIndex} />
        &nbsp;<TimeRangeControl watchIndex={watchIndex} />

        <HitsTimeline watchIndex={watchIndex} />
    </div>
}

function EditLink({watchIndex}) {
    return <Link to={`/watch/${watchIndex}/edit`} >
        <Button data-test-id="edit-config" size="sm">
            <FontAwesomeIcon icon="wrench" />
        </Button>
        </Link>
}