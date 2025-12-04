import React from 'react';
import Headerone from '../../components/Header/Headerone';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import Hero from '../../components/Home/Hero';
import Features from '../../components/Home/Features';
import Categories from '../../components/Home/Categories';
import FeaturedFoods from '../../components/Home/FeaturedFoods';
import Stats from '../../components/Home/Stats';
import './Home.css';

const Home = () => {
    return (
        <>
            <Headerone />
            <AnimatedBackground variant="gradient" />

            <div className="home-page">
                <Hero />
                <Features />
                <Categories />
                <FeaturedFoods />
                <Stats />
            </div>
        </>
    );
};

export default Home;
