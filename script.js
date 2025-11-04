// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Petition form
    const petitionForm = document.querySelector('#petitionModal form');
    if (petitionForm) {
        petitionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message
            const modalBody = this.closest('.modal-body');
            modalBody.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                    <h4 class="mt-3 mb-2">Thank You!</h4>
                    <p class="text-muted">Your signature has been recorded. Together we're making a difference!</p>
                    <button type="button" class="btn btn-primary mt-3" data-bs-dismiss="modal">Close</button>
                </div>
            `;
            
            console.log('Petition signed:', data);
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .pillar-card, .comparison-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.textContent.replace(/,/g, ''));
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Share functionality
function shareOnSocial(platform) {
    const url = window.location.href;
    const text = "Support nursing interns in Sindh! Join the Pen4PAY movement for fair stipends.";
    
    let shareUrl;
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Add click handlers to share buttons
document.addEventListener('DOMContentLoaded', function() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.querySelectorAll('.btn').forEach((btn, index) => {
            const platforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
            btn.addEventListener('click', () => {
                if (platforms[index] === 'instagram') {
                    alert('To share on Instagram:\n1. Take a screenshot\n2. Open Instagram Stories\n3. Upload and tag #Pen4PAY');
                } else {
                    shareOnSocial(platforms[index]);
                }
            });
        });
    }
});

// Copy letter to clipboard
function copyLetter() {
    const letterContent = document.getElementById('letterContent').innerText;
    
    navigator.clipboard.writeText(letterContent).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try selecting and copying manually.');
    });
}

// Show copy success notification
function showCopySuccess() {
    const notification = document.createElement('div');
    notification.className = 'copy-success';
    notification.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Letter copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Download letter as PDF (simplified version - opens print dialog)
function downloadLetter() {
    // Create a printable version
    const letterContent = document.getElementById('letterContent').cloneNode(true);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Letter to PNMC - Pen4PAY</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    padding: 2cm;
                    line-height: 1.8;
                    color: #000;
                }
                .letter-to, .letter-subject, .letter-salutation, 
                .letter-content, .letter-closing, .letter-address {
                    margin-bottom: 1.5rem;
                }
                .letter-content p {
                    margin-bottom: 1rem;
                    text-align: justify;
                }
                .alert {
                    border: 2px solid #0066FF;
                    padding: 1rem;
                    margin-top: 2rem;
                }
                .field-line {
                    border-bottom: 1px solid #000;
                    min-height: 30px;
                    margin: 0.5rem 0;
                }
                .form-field {
                    margin: 1rem 0;
                }
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -15px;
                }
                .col-md-6 {
                    flex: 0 0 50%;
                    padding: 0 15px;
                }
                @media print {
                    body { padding: 1cm; }
                }
            </style>
        </head>
        <body>
            ${letterContent.innerHTML}
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 100);
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Quick send form handler
document.addEventListener('DOMContentLoaded', function() {
    const quickSendForm = document.getElementById('quickSendForm');
    if (quickSendForm) {
        quickSendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[placeholder="Your Full Name"]').value;
            const email = this.querySelector('input[placeholder="Your Email"]').value;
            const province = this.querySelector('input[placeholder="Province"]').value;
            const district = this.querySelector('input[placeholder="District"]').value;
            const institution = this.querySelector('input[placeholder="Institution"]').value;
            
            // Create mailto link with pre-filled content
            const subject = 'Request for Paid Internship for Nursing Students';
            const body = `To:
The Registrar,
Pakistan Nursing & Midwifery Council (PNMC),
Islamabad.

Subject: Request for Paid Internship for Nursing Students

Respected Sir/Madam,

We, the nursing students of Sindh, request the implementation of a paid internship policy for all nursing interns. According to the Internship Policy 2021, every trainee nurse should receive a stipend equal to the basic pay of BPS-16 during the training period.

However, we currently receive no stipend. We kindly request PNMC to take action and, as the regulatory body, ensure the enforcement of this policy so that stipends are granted to all nursing interns — from both public and private institutions — in recognition of their hard work and dedicated service.

With respect,

${name}
Nursing Student
Province: ${province}
District: ${district}
Institution: ${institution}
Email: ${email}
Date: ${new Date().toLocaleDateString()}

---
Sent via Pen4PAY Campaign
`;
            
            // Open email client with both PNMC emails
            const mailtoLink = `mailto:info@pnmc.org.pk,registrar@pnmc.org.pk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            
            // Show success message
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Opening Email Client...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showCopySuccess();
            }, 3000);
        });
    }
});

console.log('Pen4PAY - Fighting for nursing justice in Sindh 💙');


// ===== SHARE CAMPAIGN FUNCTIONALITY =====

// Share Campaign Messages
const shareMessages = {
    1: "Nursing interns in Sindh work 8-12 hour shifts WITHOUT any stipend, while other provinces provide financial support. This is unjust! Join #Pen4PAY to demand fair stipends for our healthcare heroes. 🩺💙 #NursingJustice #SindhNurses #HealthcareHeroes #PNMC",
    2: "Punjab ✅ KPK ✅ Balochistan ✅ provide stipends to nursing interns. Sindh ❌ does NOT. Why are Sindh's nursing students left behind? Support #Pen4PAY for equal treatment! 🏥 #FairPay #NursingInterns #SindhHealthcare #StudentRights",
    3: "Nursing students serve on the frontlines of healthcare, yet Sindh offers them ZERO financial support. According to PNMC's Internship Policy 2021, they deserve BPS-16 stipends. Stand with us! 💪 #Pen4PAY #NursingRights #SindhNurses #HealthcareEquality"
};

// Get selected message
function getSelectedMessage() {
    const selectedRadio = document.querySelector('input[name="messageOption"]:checked');
    const messageNum = selectedRadio ? selectedRadio.closest('.message-card').dataset.message : '1';
    return shareMessages[messageNum];
}

// Copy share message
function copyShareMessage() {
    const message = getSelectedMessage();
    
    navigator.clipboard.writeText(message).then(() => {
        showCopySuccess('Message copied! Now paste it on your social media.');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please try selecting and copying manually.');
    });
}

// Copy hashtags
function copyHashtags() {
    const hashtags = "#Pen4PAY #NursingJustice #SindhNurses #HealthcareHeroes #FairPay #NursingInterns #PNMC #StudentRights";
    
    navigator.clipboard.writeText(hashtags).then(() => {
        showCopySuccess('Hashtags copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share on different platforms
function shareOnPlatform(platform) {
    const url = window.location.href;
    const message = getSelectedMessage();
    const title = "Pen4PAY - Fair Stipends for Nursing Interns";
    
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
            window.open(shareUrl, '_blank');
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
            window.open(shareUrl, '_blank');
            break;
            
        case 'instagram':
            alert('To share on Instagram:\n\n1. Copy the message using the button above\n2. Take a screenshot of this page\n3. Open Instagram Stories\n4. Upload the screenshot\n5. Paste the message and add #Pen4PAY\n\nThank you for spreading awareness! 💙');
            break;
    }
}

// Message card selection handler
document.addEventListener('DOMContentLoaded', function() {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            messageCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });
});
