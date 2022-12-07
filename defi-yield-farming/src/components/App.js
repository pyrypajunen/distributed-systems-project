/// This is the main file

import React, {Component} from 'react'
import Web3 from 'web3'
import './App.css'
import Main from'./Main.js'
import NavBar from './Navbar.js'
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DB from '../truffle_abis/DecentralBank.json'


class App extends Component {

    // call loadWeb3 function before anoything else "Way to conncet your wallet to app"
    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData() // reads crypto wallet account
    }
    
    async loadWeb3() {
        if (window.ethereum) {
            // make a new instance of web3, wait and enable it
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('404! Check our MetaMask!!')

        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({account: accounts[0]})
        const networkId = await web3.eth.net.getId()
    
        // Load Tether TOKEN
        const tetherData = Tether.networks[networkId]
        console.log(tetherData)
        if(tetherData) {
          const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
          this.setState({tether})
          let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
          this.setState({ tetherBalance: tetherBalance.toString()})
          console.log("Current balance in Wei",tetherBalance)
        } else {
          window.alert("tether contract not deployed!")
        }

        // Load RWD contract
        const rwdData = RWD.networks[networkId]
        console.log(rwdData)
        if (rwdData) {
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({ rwdBalance: rwdBalance.toString()})
            console.log('Current rwd balance:', rwdBalance)
        } else {
            window.alert('Reward Token contract not deployed!')
        }

        // load Decentral bank contract
        const dbData = DB.networks[networkId]
        if (dbData) {
            const db = new web3.eth.Contract(DB.abi, dbData.address)
            this.setState({db})
            let dbBalance = await db.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: dbBalance.toString()})
            console.log('Current staking balance',dbBalance)
        } else {
            window.alert('DB contract not deployed!')
        }

        // set this loading to true, if all contracts are deployed!
        this.setState({loading: false})
        console.log("All contracts are deployed!")

    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true

        }
    }

    render() {
        let content
        {this.state.loading ? content =
        <p id='loader' className='text-center' style={{margin: '30px'}}> 
        LOADING THE PAGE... PLEASE WAIT!!!</p> : content = <Main/>}
        return (
            <div>
                <NavBar account = {this.state.account}/>
                    <div className='container-fluid mt-5' >
                        <div className='row'>
                            <main role= 'main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight: '100vm'}}>
                                <div>
                                    {content}
                                </div>
                            </main>
                        </div>
                    </div>   
            </div> 
        )
    }
}

export default App;