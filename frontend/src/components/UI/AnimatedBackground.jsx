import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

const AnimatedBackground = ({ variant = 'particles' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (variant === 'gradient') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 30;

        // Food emojis for particles
        const foodEmojis = ['🍕', '🍔', '🍟', '🌮', '🍱', '🍜', '🍝', '🥗'];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 30 + 20;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.size}px Arial`;
                ctx.fillText(this.emoji, this.x, this.y);
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [variant]);

    if (variant === 'gradient') {
        return (
            <div className="animated-bg-gradient">
                <motion.div
                    className="gradient-blob blob-1"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="gradient-blob blob-2"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="gradient-blob blob-3"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
        );
    }

    return <canvas ref={canvasRef} className="animated-bg-canvas" />;
};

export default AnimatedBackground;
