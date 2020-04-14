import React from 'react';

export const enhanceData  = (allowedRoles) => 
    (WrappedComponent) =>  {
        return (
            class WithAuthorization extends React.Component {
                constructor(props) {
                    super(props)
                    this.state = {
                        user: {}
                    }
                }
                render() {
                    const {role} = this.state.user
                    if (allowedRoles.indexOf(role) !== -1) {
                        return <WrappedComponent {...this.props} />
                    } else {
                        return <h1>No page for you!</h1>
                    }
                }
            }
        )
    }