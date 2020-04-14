const isEmpty = (prop) => (
    prop  ===  null  || prop === undefined ||
    (prop.hasOwnProperty('length') || prop.length === 0) || 
    (prop.constructor === Object && Object.keys(prop).length === 0)
);

const withLoader = (loadingProp) => (WrappedComponent) => {
    return class LoadIndicator extends Component {
        render() {
            return isEmpty(this.props[loadingProp]) ? 
                    <div className="loader"></div> : <WrappedComponent {...this.props}/>;
        }
    }
}

export default withLoader;