import React, { useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import FooterSection from '../components/landing/FooterSection';
import { features, pricingPlans, testimonials } from "../assets/data"; // mporting data objects.
import { useClerk, useUser } from '@clerk/clerk-react'; 
import { useNavigate } from 'react-router-dom'; //React Router tool // Used to change pages programmatically

const Landing = () => {
    // hooks initialization
    const { openSignIn, openSignUp } = useClerk();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    // function for login/signup (Get Started) button clicks
    const handleGetStarted = () => {
        if (isSignedIn) {
            navigate('/dashboard');
            return;
        }
        openSignUp();
    };
 
    // function for sign in button click
    const handleSignIn = () => {
        if (isSignedIn) {
            navigate('/dashboard');
            return;
        }
        openSignIn();
    };

    useEffect(() => {
        if (isSignedIn) {
            navigate('/dashboard');
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100 ">

            {/* Hero Section */}
            <HeroSection openSignIn={handleSignIn} openSignUp={handleGetStarted} />

            {/* Feature Section */}
            <FeatureSection features={features} /> {/* Mount FeatureSection component here */}

            {/* Pricing Section */}
            <PricingSection pricingPlans={pricingPlans}  // passing props --> prop name  = function reference
             openSignUp = {openSignUp}/>

            {/* Testimonials Section */}
            <TestimonialsSection testimonials={testimonials} />

            {/* CTA Section */}
            <CTASection openSignUp = {openSignUp}/>

            {/* Footer Section */}
            <FooterSection />

        </div>
    );
};

export default Landing;