const Lin = require("../src/lin")

class MyApp extends Lin.Component {
    render() {
        return (
            <div>
                <h2>Lin Mini React Demo</h2>
                <Info></Info>
            </div>
        )
    }
}

class Info extends Lin.Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0
        }
        setInterval(() => {
            this.setState({
                num: this.state.num + 1
            })
        }, 1000)
        // this.buttonClick = this.buttonClick.bind(this);
    }

    // buttonClick() {
    //     this.setState({
    //         num: this.state.num + 1
    //     })
    // }


    render() {
        return (
            <div>
                <h3 style={{
                    fontSize: '20px',
                    color: 'red'
                }}>每隔一秒更新一次: {this.state.num} </h3>
                {/* <button onClick={()=>{
                    alert("111")
                    this.buttonClick()
                }}>点击我</button> */}
            </div>
        )
    }
}

Lin.render(<MyApp />, document.getElementById("root"))