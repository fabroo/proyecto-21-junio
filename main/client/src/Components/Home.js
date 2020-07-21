import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import Python from '../Services/postPython'
import { Link } from 'react-router-dom'
import Brenda from '../photos/brenda.jpg'
import Fabro from '../photos/fabro.jpg'
import Tievo from '../photos/tievo.jpg'
const Home = (props) => {

    const authContext = useContext(AuthContext);
    ////console.log(authContext);

    return (
        <div className="holu"><div className="container">
            <br />
            <div>{authContext.isAuthenticated ? (<div className="jumbotron">
                <h1 className="display-4">Hello, {authContext.user.username}!</h1>
                <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <Link className="btn btn-primary btn-lg" to="#" role="button">Learn more</Link>
            </div>) : (<div className="jumbotron">
                <h1 className="display-4">Hello!</h1>
                <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <Link className="btn btn-primary btn-lg" to="#" role="button">Learn more</Link>
            </div>)}</div>
            <br />
            <section className="page-section bg-light contenedor-servicios" id="services">
            <div className="container" >
                <div className="text-center" data-aos="fade-up"  data-aos-duration="1000">
                    <h2 className="section-heading ">Servicios</h2>
                </div>
                <div className="row text-center">
                    <div className="col-md-4"  data-aos="flip-up"
                    data-aos-anchor-placement="bottom-bottom"   data-aos-duration="1000" >
                        <span className="fa-stack fa-4x span-logo"><i className="fas fa-circle fa-stack-2x text-primary"></i><i className="fas fa-door-open fa-stack-1x fa-inverse"></i></span>
                        <h4 className="my-3">Seguridad</h4>
                        <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.</p>
                    </div>
                    <div className="col-md-4 " data-aos="flip-up"
                    data-aos-anchor-placement="bottom-bottom" data-aos-duration="1000" data-aos-delay="100">
                        <span className="fa-stack fa-4x span-logo"><i className="fas fa-circle fa-stack-2x text-primary"></i><i className="far fa-id-badge fa-stack-1x fa-inverse"></i></span>
                        <h4 className="my-3">Eficiencia</h4>
                        <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.</p>
                    </div>
                    <div className="col-md-4" data-aos="flip-up"
                    data-aos-anchor-placement="bottom-bottom" data-aos-duration="1000" data-aos-delay="200">
                        <span className="fa-stack fa-4x span-logo"><i className="fas fa-circle fa-stack-2x text-primary"></i><i className="fas fa-mobile-alt fa-stack-1x fa-inverse"></i></span>
                        <h4 className="my-3">Comfort</h4>
                        <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.</p>
                    </div>
                </div>
            </div>
        </section>          
            <br />
            <br/>

        <section className="page-section " id="team">
            <div className="container">
                <div className="text-center" data-aos="zoom-out-up" data-aos-duration="1000">
                    <h2 className="section-heading" >El equipo</h2>
                </div>
                <div className="row aos-init aos-animate">
                    <div className="col-lg-4" data-aos="zoom-out-up" data-aos-duration="1000" data-aos-delay="50">
                        <div className="team-member">
                            <img className="mx-auto rounded-circle fotoo" src={Brenda} alt="" />
                            
                            <h4>Brenda</h4>
                            <p className="text-muted">SQL gang</p>
                            <Link className="btn btn-dark btn-social mx-2" to="#!"><i className="fab fa-twitter"></i></Link><Link className="btn btn-dark btn-social mx-2" to="https://www.instagram.com/brenchulain7"><i className="fab fa-instagram"></i></Link>
                        </div>
                    </div>
                    <div className="col-lg-4"data-aos="zoom-out-up" data-aos-duration="1000"  data-aos-delay="100">
                        <div className="team-member">
                            <img className="mx-auto rounded-circle fotoo" src={Tievo} alt="" />
                            
                            <h4>Teivo</h4>
                            <p className="text-muted">Arregla las cagadas de Fabro</p>
                            <Link className="btn btn-dark btn-social mx-2" to="#!"><i className="fab fa-twitter"></i></Link><Link className="btn btn-dark btn-social mx-2" to="https://www.instagram.com/tievo_/"><i className="fab fa-instagram"></i></Link>
                        </div>
                    </div>
                    <div className="col-lg-4"data-aos="zoom-out-up" data-aos-duration="1000"  data-aos-delay="200">
                        <div className="team-member">
                            <img className="mx-auto rounded-circle fotoo" src={Fabro} alt="" />
                           
                            <h4>Fabro</h4>
                            <p className="text-muted">Me mando las cagadas</p>
                            <Link className="btn btn-dark btn-social mx-2" to="#!"><i className="fab fa-twitter"></i></Link><Link className="btn btn-dark btn-social mx-2" to="https://www.instagram.com/fabro__________/"><i className="fab fa-instagram"></i></Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8 mx-auto text-center"><p className="large text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut eaque, laboriosam veritatis, quos non quis ad perspiciatis, totam corporis ea, alias ut unde.</p></div>
                </div>
            </div>
        </section>
   
            <br/>
            <br/>
            <Python />
            <br />

        </div>
        </div>
    )
}

export default Home;