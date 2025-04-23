// IMPORTS ----------------------------------------------------------------------------------------
import { useLayoutEffect } from "react";
import Footer from "../components/Footer";

// PRIVACY PAGE -----------------------------------------------------------------------------------
const PrivacyPolicy = ({ setShowNavbar }) => {

    // NOTE: SETTING NAV BAR TO TRUE --------------------------------------------------------------
    useLayoutEffect(() => {
        setShowNavbar(true);
    }, [])

    return (
        <div className="home-page">
            <div className="static-content">
                <div className="title-container">
                    <h1>Privacy Policy</h1>
                    <i>Last updated on: 10/04/2025</i>
                </div>
                <div className="welcome-container">
                    <h3>Welcome to EdibleEducation!</h3>
                    <p>EdibleEducation values your data, and would like to make sure that handles your data in a safe and appropriate manner.</p>
                </div>
                <ol>
                    <div className="section">
                        <h3><li>Information We Collect</li></h3>
                        <p>We may collect the following types of information:</p>
                        <ol>
                            <li>Personal Information, such as email address</li>
                            <li>User-Generated Content, such as recipes, comments, and other content you upload or share on the Platform</li>
                            <li>Technical Data, such as usage data</li>
                        </ol>
                    </div>
                    <div className="section">
                        <h3><li>How We Use Your Information</li></h3>
                        <p>Your information is used to:</p>
                        <ul>
                            <li>Provide, maintain, and improve EdibleEducation</li>
                            <li>Display your uploaded content (e.g., recipes, comments) to other users</li>
                            <li>Communicate with you (through email address)</li>
                            <li>Enforce our Terms and Conditions and monitor for inappropriate content</li>
                        </ul>
                    </div>
                    <div className="section">
                        <li><h3>How We Share Your Information</h3></li>
                        <p>Here at EdibleEducation we <b>DO NOT</b> sell your information.</p>
                        <p>Your information is not shared with outsider parties.</p>
                        <p>In case your information needs to be shared, that would only be the case with your explicit consent.</p>
                        <p>The user-submitted content (recipes, and comments), is publicaly available and visible on the paltform.</p>
                    </div>
                    <div className="section">
                        <li><h3>Your Rights</h3></li>
                        <p>You have the right to:</p>
                        <ol>
                            <li>Delete your personal information at any time.</li>
                            <li>Remove your uploaded content at any time.</li>
                        </ol>
                    </div>
                    <div className="section">
                        <li><h3>Security</h3></li>
                        <p>We take appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure.</p>
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

export default PrivacyPolicy

// END OF DOCUMENT --------------------------------------------------------------------------------