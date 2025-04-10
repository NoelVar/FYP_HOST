import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="section-container">
                <div className="section-1">
                    <h4>Get in touch</h4>
                    <p><i class="fa-solid fa-envelope"></i>edibleeducation.contact@gmail.com</p>
                    <p><i class="fa-brands fa-linkedin"></i><Link to='https://linkedin.com/in/noel-varga' target="_blank" rel="noopener noreferrer">linkedin.com/in/noel-varga</Link></p>
                </div>
                <div className="section-2">
                    <h4>About EdibleEducation</h4>
                    <Link to='/terms-and-conditions'>Terms & Conditions</Link>
                    <Link to='/privacy-policy'>Privacy Policy</Link>
                    <Link to='/#about-container'>About EdibleEducation</Link>
                </div>
            </div>
            <p className="copyright"><i class="fa-solid fa-copyright"></i> Noel Varga 2025</p>
        </div>
    )
}

export default Footer