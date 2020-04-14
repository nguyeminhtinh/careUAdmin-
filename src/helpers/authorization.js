import React from 'react';
import { getCurrentUser } from "../services/authService";
const Authorization  = (allowedRoles) => 
    (WrappedComponent) =>  {
        return (
            class WithAuthorization extends React.Component {
                constructor(props) {
                    super(props)
                    this.state = {
                        user: getCurrentUser()
                    }
                }
                render() {
                    const {role, isApproved} = this.state.user
                    if (allowedRoles.indexOf(role) !== -1 && isApproved) {
                        return <WrappedComponent {...this.props} />
                    } else {
                        return <h1>No page for you!</h1>
                    }
                }
            }
        )
    }


const AuthorizationOnlyMaster  = (allowedRoles) => 
    (WrappedComponent) =>  {
        return (
            class WithAuthorization extends React.Component {
                constructor(props) {
                    super(props)
                    this.state = {
                        user: getCurrentUser()
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

export {Authorization, AuthorizationOnlyMaster};
