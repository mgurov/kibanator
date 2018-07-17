import React from 'react'
import TimeRangeControl from '../timerange/TimeRangeControl';
import HitsTimeline from '../datalist/HitsTimeline';
import {Link, Switch, Route} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import EditConfig from './edit/EditConfig';

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
        <Button className="btn btn-xs glyphicon glyphicon-wrench" data-test-id="edit-config"/>
        </Link>
}