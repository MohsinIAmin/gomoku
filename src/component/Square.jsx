import React from 'react';

class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {}

    getColor(val) {
        if (val === 'x') {
            return 'white';
        } else if (val === 'o') {
            return 'black';
        } else {
            return 'none';
        }
    }

    render() {
        return (
            <button className='square'
                onClick={() => this.props.onClick()}
                style={{
                    // padding: '0px'
                }}
            >
                <svg height={40} width={40}>
                    <circle cx='20' cy='20' r='8' fill={this.getColor(this.props.value)} />
                </svg>
            </button>
        );
    }
}

export default Square;