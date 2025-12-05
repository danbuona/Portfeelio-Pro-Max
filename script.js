// ===========================
// Logo Assembly Animation
// ===========================
window.addEventListener('load', () => {
    const logoPath = document.getElementById('logo-path');
    if (logoPath) {
        // Remove and re-add animation class to trigger on page load
        logoPath.style.animation = 'none';
        setTimeout(() => {
            logoPath.style.animation = 'logo-assemble 2.5s ease-out forwards';
        }, 100);
    }
});

// ===========================
// Mobile Navigation Toggle
// ===========================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===========================
// Navbar Hide on Scroll
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= scrollThreshold) {
        navbar.classList.remove('hide');
    } else if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        // Scrolling down
        navbar.classList.add('hide');
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        navbar.classList.remove('hide');
    }

    lastScroll = currentScroll;
});

// ===========================
// Smooth Scroll with Offset
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
animatedElements.forEach(el => observer.observe(el));

// ===========================
// Counter Animation for Stats
// ===========================
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let countersAnimated = false;

const animateCounters = () => {
    if (countersAnimated) return;

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });

    countersAnimated = true;
};

// ===========================
// Live Experience Counter (Since 2015)
// ===========================
const experienceCounter = document.getElementById('experience-counter');
const startDate = new Date('2015-01-01T00:00:00'); // Start from January 1, 2015
let experienceAnimated = false;
let experienceIntervalId = null;

const calculateExperience = () => {
    const now = new Date();
    const diff = now - startDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const remainingAfterYears = diff % (1000 * 60 * 60 * 24 * 365.25);
    const days = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24));
    const remainingAfterDays = remainingAfterYears % (1000 * 60 * 60 * 24);
    const minutes = Math.floor(remainingAfterDays / (1000 * 60));
    const remainingAfterMinutes = remainingAfterDays % (1000 * 60);
    const seconds = Math.floor(remainingAfterMinutes / 1000);

    return { years, days, minutes, seconds };
};

const updateExperienceCounter = (currentYears, currentDays, currentMinutes, currentSeconds) => {
    if (experienceCounter) {
        experienceCounter.innerHTML = `${currentYears}<span class="counter-unit">Yr</span>:${currentDays}<span class="counter-unit">Days</span>:${currentMinutes}<span class="counter-unit">Min</span>:${currentSeconds}<span class="counter-unit">Sec</span>`;
    }
};

const animateExperienceCounter = () => {
    if (experienceAnimated) return;
    experienceAnimated = true;

    const target = calculateExperience();
    const duration = 2000; // 2 seconds to animate
    const steps = 60; // 60 frames
    const stepDuration = duration / steps;

    let currentStep = 0;

    const animate = () => {
        currentStep++;
        const progress = currentStep / steps;

        const currentYears = Math.floor(target.years * progress);
        const currentDays = Math.floor(target.days * progress);
        const currentMinutes = Math.floor(target.minutes * progress);
        const currentSeconds = Math.floor(target.seconds * progress);

        updateExperienceCounter(currentYears, currentDays, currentMinutes, currentSeconds);

        if (currentStep < steps) {
            setTimeout(animate, stepDuration);
        } else {
            // After animation completes, start live updating
            const updateLive = () => {
                const live = calculateExperience();
                updateExperienceCounter(live.years, live.days, live.minutes, live.seconds);
            };
            updateLive();
            experienceIntervalId = setInterval(updateLive, 1000);
        }
    };

    animate();
};

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                animateExperienceCounter();
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ===========================
// Skills Progress Bar Animation
// ===========================
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

const animateSkills = () => {
    if (skillsAnimated) return;

    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 100);
    });

    skillsAnimated = true;
};

// Trigger skills animation when skills section is visible
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.3 });

    skillsObserver.observe(skillsSection);
}

// ===========================
// Work Items Hover Effect
// ===========================
const workItems = document.querySelectorAll('.work-item');

workItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Here you would typically send the data to a server
        console.log('Form submitted:', formData);

        // Show success message (you can customize this)
        alert('Thank you for your message! I will get back to you soon.');

        // Reset form
        contactForm.reset();
    });
}

// ===========================
// Active Navigation Link
// ===========================
const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

// ===========================
// Hero Video Background
// ===========================
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
    // Ensure video plays on load
    heroVideo.play().catch(err => {
        console.log('Video autoplay failed:', err);
    });

    // Handle video load error
    heroVideo.addEventListener('error', () => {
        console.log('Video failed to load');
        // Hide video elements if they fail to load
        const videoContainer = document.querySelector('.hero-video-container');
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }
    });
}

// ===========================
// Parallax Effect for Hero
// ===========================
const hero = document.querySelector('.hero');

if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            // Fade out more aggressively to prevent overlap
            const fadeProgress = scrolled / (heroHeight * 0.7); // Start fading earlier
            hero.style.opacity = Math.max(0, 1 - fadeProgress);
        } else {
            // Ensure hero is completely hidden after scrolling past it
            hero.style.opacity = 0;
        }
    });
}

// ===========================
// Work Filter (Optional Enhancement)
// ===========================
const workFilter = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter work items
            workItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
};

// ===========================
// Loading Animation
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// ===========================
// Performance Optimization
// ===========================
// Debounce function for scroll events
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll-heavy functions
const debouncedHighlight = debounce(highlightNavigation, 10);
window.removeEventListener('scroll', highlightNavigation);
window.addEventListener('scroll', debouncedHighlight);

// ===========================
// Scramble Text Effect
// ===========================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            // Start immediately (0) so all characters are scrambled from the beginning
            const start = 0;
            const end = start + Math.floor(Math.random() * 40) + 20;
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to hero title on load
const heroTexts = document.querySelectorAll('.hero-text');
if (heroTexts.length > 0) {
    heroTexts.forEach((textEl, index) => {
        const fx = new TextScramble(textEl);
        // Store the original HTML to preserve the cursor span
        const originalHTML = textEl.innerHTML;
        const originalText = textEl.innerText;

        // Lock the height before clearing text to prevent jitter
        const originalHeight = textEl.offsetHeight;
        textEl.style.minHeight = originalHeight + 'px';
        textEl.style.display = 'block';

        // Clear text initially
        textEl.innerText = '';

        // Start scramble effect with delay for each line
        setTimeout(() => {
            fx.setText(originalText).then(() => {
                // Restore the original HTML to get the cursor back
                if (originalHTML.includes('cursor')) {
                    textEl.innerHTML = originalHTML;
                }
                // Remove height lock after animation completes
                setTimeout(() => {
                    textEl.style.minHeight = '';
                }, 100);
            });
        }, 300 + (index * 400));
    });
}

// Apply scramble effect to section titles when they come into view
const scrambleObserverOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('scrambled')) {
            entry.target.classList.add('scrambled');
            const fx = new TextScramble(entry.target);
            const originalText = entry.target.innerText;
            fx.setText(originalText);
        }
    });
}, scrambleObserverOptions);

// Observe only section titles (reduced from all text elements)
const scrambleElements = document.querySelectorAll('.section-title');
scrambleElements.forEach(el => {
    scrambleObserver.observe(el);
});

// ===========================
// Console Easter Egg
// ===========================
console.log('%cWelcome to my portfolio!', 'color: #dff140; font-size: 20px; font-weight: bold;');
console.log('%cInterested in working together? Let\'s connect!', 'color: #ffffff; font-size: 14px;');
