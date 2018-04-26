const Lin = require("../src/lin")

class MyApp extends Lin.Component{
    render() {
        return(
            <div>
                <h2>Lin Mini React Demo</h2>
                <Info></Info>
            </div>
        )
    }
}

class Info extends Lin.Component{
    constructor() {
        super()
        this.state = {
            num: 0
        }
    }

    buttonClick() {
        this.setState({
            num: this.state.num + 1
        })
    }


    render() {
        return(
            <div>
                <h3>点击了: {this.state.num} 次</h3>
                <button onClick={()=>{this.buttonClick()}}></button>
            </div>
        )
    }
}

Lin.render(<MyApp/>, document.getElementById("root"))