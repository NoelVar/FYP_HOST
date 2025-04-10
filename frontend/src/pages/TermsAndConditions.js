import { useLayoutEffect } from "react";
import Footer from "../components/Footer";

const TermsAndConditions = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    return (
        <div className="home-page">
            <div className="static-content">
                <div className="title-container">
                    <h1>Terms and conditions</h1>
                    <i>Last updated on: 10/04/2025</i>
                </div>
                <div className="welcome-container">
                    <h3>Welcome to EdibleEducation!</h3>
                    <p>The following Terms and Conditions establishes the appropriate use of the platform, and covers possible missuse or violations.</p>
                    <p>EdibleEducation is operated by the ED<sup>2</sup> team.</p>
                    <p>By accessing and using EdibleEducation, you agree to comply with the following Terms.</p>
                </div>
                <ol>
                    <div className="section">
                        <h3><li>Eligibility</li></h3>
                        <p>The platform does not discriminate any individual from using the platform, as long as it is done so in a professional, and responsible manner.</p>
                    </div>
                    <div className="section">
                        <h3><li>User Content</li></h3>
                        <p>By uploading content (this includes comments and recipes) to EdibleEducation you agree to the following:</p>
                        <ul>
                            <li>Only upload recipes that are original or properly sources.</li>
                            <li>Ensure that all uploaded content is respectful, constructive, and free from offensive, and inappropriate language.</li>
                            <li>Not submit content that contains hate speech, personal attacks, vulgarity, or promotional spam</li>
                            <li>Take full responsibility for the content you upload, including ensuring that it does not infringe on the rights of any third party (e.g., copyrighted materials)</li>
                        </ul>
                        <b>We reserve the right to remove any content that violates these standards and to suspend or terminate accounts for repeated or serious violations.</b>
                    </div>
                    <div className="section">
                        <li><h3>Intellectual Property</h3></li>
                        <p>You retain ownership of any content you submit, however by submiting recipes to the platform you grant the ability to use, display, reproduce, and distribute the content for operational porpuses.</p>
                        <p>You must not upload any content you do not have the legal right to share, including recipes or materials copied from cookbooks, websites, or other users without permission or proper citation.</p>
                    </div>
                    <div className="section">
                        <li><h3>Disclaimer</h3></li>
                        <p>EdibleEducation aims to provide the best possible user experience. However, since the platfrom is community based the accuracy of the user-submited content cannot be guaranteed, so it needs to be taken with a <i>grain of salt</i>.</p>
                    </div>
                    <div className="section">
                        <li><h3>Termonation</h3></li>
                        <p>We reserve the right to suspend or terminate your access to the Platform at any time, without prior notice, if we believe you have violated these Terms.</p>
                    </div>
                    <div className="section">
                        <li><h3>Contact us</h3></li>
                        <p>For more information please contact us at: <b>edibleeducation.contact@gmail.com</b></p>
                    </div>
                </ol>
            </div>
            <Footer />
        </div>
    )
}

export default TermsAndConditions