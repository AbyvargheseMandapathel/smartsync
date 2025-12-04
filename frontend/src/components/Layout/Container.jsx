import React from 'react';
import './Container.css';

const Container = ({ children, className = '', maxWidth = 'default', ...props }) => {
    const containerClasses = [
        'layout-container',
        `container-${maxWidth}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} {...props}>
            {children}
        </div>
    );
};

export default Container;
