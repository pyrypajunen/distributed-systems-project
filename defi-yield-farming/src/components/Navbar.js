import React, {Component} from 'react'

class Navbar extends Component {
    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'black', height:'50px'}}>
                <a className='navbar-brand col-sm-3 col-md-2 mr-0' 
                style={{color:'white'}}
                href='/#'>
                &nbsp; DAPP Yield Farming (Decentralized Banking)
                </a>
                <ul className='navbar-nav px-3'>
                    <li>
                        <small style={{color:'white'}}> Crypto Wallet Address: {this.props.account}
                        </small>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar;