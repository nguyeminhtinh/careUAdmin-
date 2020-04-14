import React from 'react';

function WithLoading(Component) {
    return function WihLoadingComponent({ isLoading, ...props }) {
        if (!isLoading) return (<Component {...props} />);
        return (<div className="text-center" ><div className="spinner-border text-info text-center"></div></div>);
    }
}
export default WithLoading;
