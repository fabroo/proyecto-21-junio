import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="page-footer font-small bg-info pt-4 footer" style={{
        position: 'absolute',
        marginTop: '15vh',
        bottom: 0,
        width: '100%'
      }} >
        <div className="container-fluid text-center text-light text-md-left">
          <div className="row " >
            <div className="col-md-6 mt-md-0 mt-3">
              <h5 className="text-uppercase">Leo Mattioli - Sociedad Anónima</h5>
              <p>Lorem ipsum dolor sit amet consectetur . sit amet consectetur . sit amet consectetur .</p>
            </div>
            <hr className="clearfix w-100 d-md-none pb-3" />
            <div className="col-md-3 mb-md-0 mb-3">
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a className="text-light" href="#!">Mail</a>
                </li>


              </ul>
            </div>
            <div className="col-md-3 mb-md-0 mb-3">
              <h5 className="text-uppercase">Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a className="text-light" href="#!">About Us</a>
                </li>


              </ul>
            </div>
          </div>
        </div>
        <div className="text-light footer-copyright text-center py-3">© 2020 Copyright:
    <a href="https://mdbootstrap.com/" className="text-light"> Buenos Aires, Argentina</a>
        </div>
      </footer>
    </div >
  )
}


export default Footer;