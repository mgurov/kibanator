import React from 'react'
import {Well} from 'react-bootstrap'

class AndNMoreNoPagingExplained extends React.Component {

    constructor(props) {
        super(props)
        this.state = { show: false }
        let that = this
        this.toggle = (e) => {
            e.preventDefault()
            that.setState({ show: !that.state.show })
        }
    }

    render() {
        let { count } = this.props
        if (count <= 0) {
            return null
        }

        return <div>
            <em>And {count} <a href="#readMore" onClick={this.toggle}>more...<span className="caret"></span></a></em>
            {this.state.show &&
                <Well>
                    <button type="button" className="close" aria-label="Close" onClick={this.toggle}><span aria-hidden="true">&times;</span></button>
                    <p>Why do we not show more?
                      Kibanator helps you to react on events in <abbr title="First In First Out" className="initialism">FIFO</abbr> manner. Like your mail inbox.
                      For other use cases you would probably switch to more suitable tools. Think kibana (which kibanator isn't supposed to replace fully).
                      </p><p>
                        Drop us a line with a good counter-example for kibanator to support paging.
                      </p>
                </Well>
            }
        </div>
    }
}

export default AndNMoreNoPagingExplained