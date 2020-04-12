# forkifyimport React from 'react';

export default class test extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: 'hari'
        }
        // this.clickEvent = this.clickEvent.bind(this)  approache 3 with constructor
    }

    clickEvent = () => {
        console.log(this);
        this.setState({ name: 'krishna' })

    }

    render() {
        return (
            <div>
                <text>{this.state.name}</text>

                {/* <button style={{backgroundColor:'red', height: 50, width: 100}} onClick={this.clickEvent.bind(this)}>Click Me</button> */}

                {/* <button style={{ backgroundColor: 'red', height: 50, width: 100 }} onClick={() => this.clickEvent()}>Click Me</button> */}


                {/* function calling same in approache 3 and 4  */}

                <button style={{ backgroundColor: 'red', height: 50, width: 100 }} onClick={this.clickEvent}>Click Me</ button>


            </div>
        );
    }
}
