import React from 'react'
import { NavItem, Nav, NavLink, TabContent, TabPane } from 'reactstrap'
import classnames from 'classnames'
import _ from 'lodash'

export default class NavTabs extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: props.activeTab || _.get(props, 'children[0].key') || 0
        }
        this.toggle = (activeTab) => this.setState({ activeTab })

    }

    render() {
        return <>
            <Nav tabs>
                {
                    _.map(this.props.children, (tab, tabIndex) => {
                        let tabKey = tab.key || tabIndex
                        return <NavItem key={tabKey}>
                            <NavLink
                                className={classnames('navbar-toggler', {active: this.state.activeTab === tabKey })}
                                onClick={() => { this.toggle(tabKey); }}
                            >
                                {tab.title}
                            </NavLink>
                        </NavItem>
                    }

                    )
                }
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                {
                    _.map(this.props.children, (tab, tabIndex) => {
                        let tabKey = tab.key || tabIndex
                        return <TabPane key={tabKey} tabId={tabKey}>
                            {tab.content}
                        </TabPane>
                    }
                    )
                }
            </TabContent>
        </>
    }
}
